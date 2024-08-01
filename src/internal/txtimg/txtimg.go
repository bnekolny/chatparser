package txtimg

import (
	"embed"
	"github.com/fogleman/gg"
	"image/jpeg"
	"io"
	"log"
	"os"
)

// keeping this here so it ensures the file exists
//
//go:embed arial.ttf
var arialFontFS embed.FS

// to be satisfied upon init
var arialFontPath string

func init() {
	fontData, err := arialFontFS.ReadFile("arial.ttf")
	if err != nil {
		log.Fatalf("Failed to read embedded font file: %v", err)
	}

	tempFile, err := os.CreateTemp("", "arial.ttf")
	if err != nil {
		log.Fatalf("Failed to create temporary file: %v", err)
	}
	defer tempFile.Close()

	if _, err := tempFile.Write(fontData); err != nil {
		log.Fatalf("Failed to write font data to temporary file: %v", err)
	}

	arialFontPath = tempFile.Name()
}

func GenerateJPG(text string, w io.Writer) error {
	const width, height = 1200, 630
	const fontSize = 100
	const quality = 30
	const p = 16 // what is this???

	dc := gg.NewContext(width, height)
	dc.SetRGB(1, 1, 1)
	dc.Clear()

	if err := dc.LoadFontFace(arialFontPath, fontSize); err != nil {
		return err
	}

	dc.SetRGB(0, 0, 0)
	dc.DrawStringWrapped(text, width/2, height/2, 0.5, 0.5, width, 1.5, gg.AlignCenter)
	img := dc.Image()

	var opt jpeg.Options
	opt.Quality = quality
	return jpeg.Encode(w, img, &opt)
}
