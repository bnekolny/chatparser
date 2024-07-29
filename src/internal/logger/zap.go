package logger

import (
	"go.uber.org/zap"
	//adapter "github.com/axiomhq/axiom-go/adapters/zap"
)

var Logger *zap.SugaredLogger

func init() {
	zapLogger, _ := zap.NewDevelopment() // zap.NewProduction()
	Logger = zapLogger.Sugar()
}
