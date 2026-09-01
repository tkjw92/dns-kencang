package main

import (
	"fmt"
	"os"
	"strings"
)

type Node struct {
	Children map[string]*Node
	Terminal bool
	Wildcard bool
}

type DomainTree struct {
	root *Node
}

func Index() {
	tree := &DomainTree{
		root: &Node{
			Children: make(map[string]*Node),
		},
	}

	wildcards, err := os.ReadFile("output/wildcards")
	if err != nil {
		panic(err)
	}

	domains, err := os.ReadFile("output/domains")
	if err != nil {
		panic(err)
	}

	for _, i := range strings.Split(string(wildcards), "\n") {
		domain := strings.TrimSpace(i)
		if domain == "" {
			continue
		}

		tree.Insert(i)
	}

	for _, i := range strings.Split(string(domains), "\n") {
		domain := strings.TrimSpace(i)
		if domain == "" {
			continue
		}

		tree.Insert(i)
	}

	tree.PrintDomains()
}

func (t *DomainTree) Insert(domain string) {
	labels := strings.Split(strings.ToLower(strings.TrimSuffix(domain, ".")), ".")

	if len(labels) == 0 {
		return
	}

	node := t.root

	for i := len(labels) - 1; i >= 0; i-- {
		label := labels[i]

		// Kita sedang akan memasukkan label pertama/subdomain
		// pada level ini.
		//
		// Jika parent punya wildcard, maka hanya satu label
		// di level ini yang tercakup.
		if label != "*" {
			if wildcard, ok := node.Children["*"]; ok && wildcard.Wildcard {
				// Wildcard di parent hanya berlaku untuk
				// domain yang tinggal satu label lagi.
				if i == 0 {
					return
				}
			}
		}

		child, ok := node.Children[label]
		if !ok {
			child = &Node{
				Children: make(map[string]*Node),
			}

			node.Children[label] = child
		}

		node = child
	}

	if labels[0] == "*" {
		if node.Wildcard {
			return
		}

		node.Wildcard = true
		node.Terminal = false

		clear(node.Children)

		return
	}

	if node.Terminal || node.Wildcard {
		return
	}

	node.Terminal = true
}

func (t *DomainTree) Print(node *Node, prefix string) {
	for label, child := range node.Children {
		fmt.Printf("%s%s", prefix, label)

		if child.Terminal {
			fmt.Print(" [terminal]")
		}

		if child.Wildcard {
			fmt.Print(" [wildcard]")
		}

		fmt.Println()

		t.Print(child, prefix+"  ")
	}
}

func (t *DomainTree) PrintDomains() {
	var walk func(node *Node, labels []string)

	walk = func(node *Node, labels []string) {
		for label, child := range node.Children {
			current := append(labels, label)

			if child.Terminal {
				fmt.Println(reverseDomain(current))
			}

			if child.Wildcard {
				// "*" adalah child dari domain parent.
				// Jangan reverse "*" bersama label lainnya.
				fmt.Println("*." + reverseDomain(labels))
			}

			walk(child, current)
		}
	}

	walk(t.root, nil)
}

func reverseDomain(labels []string) string {
	result := make([]string, len(labels))

	for i := range labels {
		result[len(labels)-1-i] = labels[i]
	}

	return strings.Join(result, ".")
}
