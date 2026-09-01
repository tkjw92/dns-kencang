package lib

import "strings"

func IsWildcard(d string) bool {
	if strings.HasPrefix(d, "*") {
		return true
	}

	return false
}
