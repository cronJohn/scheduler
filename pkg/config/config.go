package config

import (
	"encoding/json"
	"os"

	"github.com/rs/zerolog/log"
)

type Config struct {
	Backend struct {
		SSPort     string `json:"SS_PORT"`
		SSUsername string `json:"SS_USERNAME"`
		SSPassword string `json:"SS_PASSWORD"`
		SSDB       string `json:"SS_DB"`
		SSCK       string `json:"SS_CK"`
		TLSCert    string `json:"TLS_CERT"`
		TLSKey     string `json:"TLS_KEY"`
	} `json:"backend"`
	Frontend struct {
		URI       string   `json:"URI"`
		WeekStart int      `json:"WEEK_START"`
		Roles     []string `json:"ROlES"`
	} `json:"frontend"`
}

var ConfigData Config

func LoadConfig(fileName string) error {
	file, err := os.ReadFile("config.json")
	if err != nil {
		log.Fatal().Msgf("Unable to read config file: %v", err)
		return err
	}
	err = json.Unmarshal(file, &ConfigData)
	if err != nil {
		log.Fatal().Msgf("Unable to parse config file: %v", err)
		return err
	}

	return nil
}
