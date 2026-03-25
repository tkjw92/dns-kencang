package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"
)

type Stats map[string]any

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	output, err := runCommand(ctx, "unbound-control", "stats")
	if err != nil {
		fmt.Printf("error: %v\n", err)
		return
	}

	stats, err := parseStatsNested(output)
	if err != nil {
		fmt.Printf("parse error: %v\n", err)
		return
	}

	if err := writeJSONAtomic("stats.json", stats); err != nil {
		fmt.Printf("write error: %v\n", err)
		return
	}

	fmt.Println("stats.json updated (nested)")
}

//
// ===== COMMAND =====
//

func runCommand(ctx context.Context, name string, args ...string) (string, error) {
	cmd := exec.CommandContext(ctx, name, args...)
	out, err := cmd.CombinedOutput()

	if ctx.Err() == context.DeadlineExceeded {
		return "", errors.New("command timeout")
	}

	if err != nil {
		return "", fmt.Errorf("command failed: %w | output: %s", err, string(out))
	}

	return string(out), nil
}

//
// ===== PARSER (NESTED) =====
//

func parseStatsNested(input string) (Stats, error) {
	root := make(Stats)

	lines := strings.Split(input, "\n")

	for i, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}

		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}

		key := strings.TrimSpace(parts[0])
		val := strings.TrimSpace(parts[1])

		if key == "" {
			return nil, fmt.Errorf("invalid key at line %d", i)
		}

		insertNested(root, key, inferType(val))
	}

	if len(root) == 0 {
		return nil, errors.New("no valid stats parsed")
	}

	return root, nil
}

//
// ===== NESTED INSERT =====
//

func insertNested(root map[string]any, key string, value any) {
	parts := strings.Split(key, ".")

	current := root

	for i := 0; i < len(parts)-1; i++ {
		k := parts[i]

		// jika belum ada → buat map
		if _, exists := current[k]; !exists {
			current[k] = make(map[string]any)
		}

		// pastikan tipe map
		next, ok := current[k].(map[string]any)
		if !ok {
			// konflik: existing bukan map → overwrite (design choice)
			next = make(map[string]any)
			current[k] = next
		}

		current = next
	}

	lastKey := parts[len(parts)-1]
	current[lastKey] = value
}

//
// ===== TYPE INFERENCE =====
//

func inferType(v string) any {
	if i, err := strconv.ParseInt(v, 10, 64); err == nil {
		return i
	}
	if f, err := strconv.ParseFloat(v, 64); err == nil {
		return f
	}
	return v
}

//
// ===== FILE WRITE =====
//

func writeJSONAtomic(filename string, data any) error {
	tmp := filename + ".tmp"

	file, err := os.Create(tmp)
	if err != nil {
		return err
	}
	defer file.Close()

	enc := json.NewEncoder(file)
	enc.SetIndent("", "  ")

	if err := enc.Encode(data); err != nil {
		return err
	}

	if err := file.Sync(); err != nil {
		return err
	}

	return os.Rename(tmp, filename)
}
