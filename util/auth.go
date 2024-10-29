package util

import (
	"github.com/cronJohn/scheduler/pkg/config"
)

func IsValidCredentials(username, password string) bool {
	return username == config.ConfigData.Backend.SSUsername && password == config.ConfigData.Backend.SSPassword
}
