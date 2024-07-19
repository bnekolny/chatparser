package main

import (
	"context"
	"io/ioutil"

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
	return "<bucket>", "<userId>/<object>.<ext>"
}

func write(userId string, objectType ObjectType, text string) (err error) {
	ctx := context.Background()

	// 1. construct path to object `getObjectRef`
	bucket, storagePath := getObjectRef(userId, objectType)
	// 2. compress text
	compressedObject := text
	// 3. write object
	client, err := getStorageClient()
	storageObj := client.Bucket(bucket).Object(storagePath)
	w := storageObj.NewWriter(ctx)
	if _, err := w.Write([]byte(compressedObject)); err != nil {
		return err
	}
	if err := w.Close(); err != nil {
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

	textBytes, err := ioutil.ReadAll(readerObj)
	readerObj.Close()
	if err != nil {
		return text, err
	}

	text = string(textBytes)

	// 3. decompress object

	return text, err
}
