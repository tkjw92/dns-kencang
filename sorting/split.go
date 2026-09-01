package main

import (
	"fmt"
	"mysorting/lib"
	"os"
	"strings"
)

func Split() {
	shardDir := "../shard"

	dir, err := os.ReadDir(shardDir)
	if err != nil {
		panic(err)
	}

	fd, err := os.OpenFile("output/domains", os.O_WRONLY|os.O_APPEND|os.O_CREATE, 0644)
	if err != nil {
		panic(err)
	}
	defer fd.Close()

	fw, err := os.OpenFile("output/wildcards", os.O_WRONLY|os.O_APPEND|os.O_CREATE, 0644)
	if err != nil {
		panic(err)
	}
	defer fw.Close()

	for _, file := range dir {
		b, err := os.ReadFile(fmt.Sprintf("%s/%s", shardDir, file.Name()))
		if err != nil {
			panic(err)
		}

		for _, record := range strings.Split(string(b), "\n") {
			r := strings.TrimSpace(record)
			if r == "" {
				continue
			}

			if lib.IsWildcard(r) {
				if _, err := fw.WriteString(r + "\n"); err != nil {
					panic(err)
				}
				continue
			}

			if _, err := fd.WriteString(r + "\n"); err != nil {
				panic(err)
			}
		}
	}
}
