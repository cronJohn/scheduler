package util

import "os"

func IsValidCredentials(username, password string) bool {
	return username == os.Getenv("SS_USERNAME") && password == os.Getenv("SS_PASSWORD")
}
