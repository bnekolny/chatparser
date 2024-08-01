package txtimg

import (
	"bytes"
	"image/jpeg"
	"io"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGenerateJPG(t *testing.T) {
	tests := []struct {
		name     string
		text     string
		wantErr  bool
		checkImg bool
	}{
		{
			name:     "Valid text",
			text:     "Hello, World!",
			wantErr:  false,
			checkImg: true,
		},
		{
			name:     "Empty text",
			text:     "",
			wantErr:  false,
			checkImg: true,
		},
		{
			name:     "Long text",
			text:     "This is a very long text that should be wrapped across multiple lines in the generated image.",
			wantErr:  false,
			checkImg: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			buf := new(bytes.Buffer)
			err := GenerateJPG(tt.text, buf)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

			if tt.checkImg {
				img, err := jpeg.Decode(bytes.NewReader(buf.Bytes()))
				require.NoError(t, err)
				assert.Equal(t, 1200, img.Bounds().Dx())
				assert.Equal(t, 630, img.Bounds().Dy())
			}
		})
	}
}

func TestGenerateJPG_WriterError(t *testing.T) {
	errWriter := &errorWriter{err: io.ErrClosedPipe}
	err := GenerateJPG("Test", errWriter)
	assert.Error(t, err)
	assert.Equal(t, io.ErrClosedPipe, err)
}

type errorWriter struct {
	err error
}

func (ew *errorWriter) Write(p []byte) (n int, err error) {
	return 0, ew.err
}
