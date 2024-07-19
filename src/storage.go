package main

import (
	"bytes"
	"compress/gzip"
	"context"
	"io"

	"cloud.google.com/go/storage"
)

const projectId = "hardcoded-fake-project"

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

func getObjectRef(userId string, objectType ObjectType) (string, string) {
	return "bucket", userId + "object.gz"
}

func write(userId string, objectType ObjectType, text string) (err error) {
	ctx := context.Background()
	logger.Info(text)

	// 1. construct path to object `getObjectRef`
	bucket, storagePath := getObjectRef(userId, objectType)

	// 2. compress text
	var compressed bytes.Buffer
	writer := gzip.NewWriter(&compressed)
	defer writer.Close()

	writer.Write([]byte(text))
	err = writer.Flush()
	if err != nil {
		return err
	}
	compressedObject := compressed.Bytes()

	logger.Info("Length of compressed data:", len(compressedObject))

	// 3. write object
	client, err := getStorageClient()
	storageObj := client.Bucket(bucket).Object(storagePath)
	w := storageObj.NewWriter(ctx)
	if _, err := w.Write(compressedObject); err != nil {
		logger.Info("write error")
		return err
	}
	if err := w.Close(); err != nil {
		logger.Info("writter close error")
		return err
	}

	return err
}

func read(userId string, objectType ObjectType) (text string, err error) {
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
	var decompressed bytes.Buffer
	reader, err := gzip.NewReader(readerObj)
	if err != nil {
		return text, err
	}
	defer reader.Close()

	_, err = io.Copy(&decompressed, reader)
	if err != nil {
		logger.Info("read error")
		logger.Info(err)
		return text, err
	}

	text = string(decompressed.Bytes())
	logger.Info("decompressed file: " + text)

	return text, err
}
