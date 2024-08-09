package handlers

import (
	"fmt"
	"html/template"
	"io"
	"io/fs"
	"net/http"
	"net/url"
	"time"

	"chatparser/internal/signature"
)

type fsAdapter struct {
	fsys fs.FS
}

func (f fsAdapter) Open(name string) (http.File, error) {
	file, err := f.fsys.Open(name)
	if err != nil {
		return nil, err
	}
	return &httpFile{file}, nil
}

type httpFile struct {
	fs.File
}

func (f *httpFile) Readdir(count int) ([]fs.FileInfo, error) {
	return nil, fmt.Errorf("Readdir not implemented")
}

func (f *httpFile) Stat() (fs.FileInfo, error) {
	return f.File.Stat()
}

func (f *httpFile) Seek(offset int64, whence int) (int64, error) {
	return f.File.(io.Seeker).Seek(offset, whence)
}

func DictTemplateData(fsys fs.FS) http.HandlerFunc {
	dictTemplatePath := "pages/dict.html"

	return func(w http.ResponseWriter, r *http.Request) {
		text := r.URL.Query().Get("text")
		unescapedText, _ := url.QueryUnescape(text)
		if unescapedText == "" {
			unescapedText = "¡Preguntame!"
		}
		ogUrl := fmt.Sprintf("/dict/og:image.jpg%s", signature.GenerateQuerystring(map[string]string{"text": unescapedText}, 3*24*time.Hour))

		templateData := struct {
			OgUrl template.HTML
		}{
			OgUrl: template.HTML(ogUrl), // #nosec G203 -- This arrives escaped from GenerateQuerystring
		}

		templateHandler(dictTemplatePath, templateData, fsys)(w, r)
	}
}

func templateHandler(templatePath string, templateData interface{}, fsys fs.FS) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tmpl, err := template.ParseFS(fsys, templatePath)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = tmpl.Execute(w, templateData)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
