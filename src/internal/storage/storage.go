package storage

import (
	"bytes"
	"compress/gzip"
	"context"
	"crypto/md5"
	"fmt"
	//"io"
	"time"

	"cloud.google.com/go/storage"
)

const projectId = "hardcoded-fake-project"
const bucket = "bucket"

type ObjectType int

const (
	Message ObjectType = iota
	Chat
	// ai response
)

func (o ObjectType) String() string {
	switch o {
	case Message:
		return "msg"
	case Chat:
		return "chat"
		// ai response
	}
	return ""
}

var storageClient *storage.Client

func getStorageClient() (*storage.Client, error) {
	// Google specifies the client should be reused as opposed to created as needed
	// https://cloud.google.com/go/docs/reference/cloud.google.com/go/storage/latest#hdr-Creating_a_Client
	if storageClient != nil {
		return storageClient, nil
	}
	ctx := context.Background()
	return storage.NewClient(ctx)
}

func getObjectRef(userId string, objectType ObjectType, objectIdentifier string) (string, string) {
	return bucket, fmt.Sprintf("%s/%s/%s_%s.txt.gz", userId, objectType.String(), time.Now().UTC().Format("2006-01-02"), objectIdentifier)
}

func Write(userId string, objectType ObjectType, text string) (err error) {
	ctx := context.Background()

	// 1. construct path to object `getObjectRef`
	md5 := fmt.Sprintf("%x", md5.Sum([]byte(text)))
	bucket, storagePath := getObjectRef(userId, objectType, md5)

	// 2. compress text
	var compressed bytes.Buffer
	writer, err := gzip.NewWriterLevel(&compressed, gzip.BestCompression)
	if err != nil {
		return err
	}
	//defer writer.Close()

	_, err = writer.Write([]byte(text))
	if err != nil {
		return err
	}
	/* don't think we need this since we're calling close() manually
	err = writer.Flush()
	if err != nil {
		return err
	}*/
	err = writer.Close()
	if err != nil {
		return err
	}

	/*compressedObject := compressed.Bytes()
		reader, err := gzip.NewReader(bytes.NewReader(compressedObject))
		if err != nil {
			return err
		}
		defer reader.Close()

		//var decompressed bytes.Buffer
		//bytesRead, err := io.Copy(&decompressed, reader)
	    decompressed, err := io.ReadAll(reader)
		if err != nil {
			return err
		}

		text = string(decompressed)*/

	// 3. write object
	client, err := getStorageClient()
	if err != nil {
		return err
	}
	storageObj := client.Bucket(bucket).Object(storagePath)
	w := storageObj.NewWriter(ctx)
	if _, err := w.Write([]byte(compressed.Bytes())); err != nil {
		return err
	}
	if err := w.Close(); err != nil {
		return err
	}

	return err
}

/*func read(userId string, objectType ObjectType) (text string, err error) {
	ctx := context.Background()

	// 1. construct path to object `getObjectRef`
	bucket, storagePath := getObjectRef(userId, objectType)
	// 2. read object
	client, err := getStorageClient()
	if err != nil {
		return text, err
	}

	readerObj, err := client.Bucket(bucket).Object(storagePath).NewReader(ctx)
	if err != nil {
		return text, err
	}
	defer readerObj.Close()

	// 3. decompress object
	var decompressed []byte
	reader, err := gzip.NewReader(readerObj)
	if err != nil {
		return text, err
	}
	defer reader.Close()

	decompressed, err = io.ReadAll(reader)
	if err != nil {
		return text, err
	}

	text = string(decompressed)

	return text, err
}*/
