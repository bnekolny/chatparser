package main

import (
	"go.uber.org/zap"
	//adapter "github.com/axiomhq/axiom-go/adapters/zap"
)

var logger *zap.SugaredLogger

func init() {
	zapLogger, _ := zap.NewDevelopment() // zap.NewProduction()
	logger = zapLogger.Sugar()
}
