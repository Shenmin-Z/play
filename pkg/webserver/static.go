package webserver

import (
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

// Serve static files
func static() {
	files := make(map[string]struct{})

	err := filepath.Walk("client/public", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			log.Fatal(err)
		}
		if info.IsDir() {
			return nil
		}

		files[path[len("client"):]] = struct{}{}
		return nil
	})

	if err != nil {
		panic(err)
	}

	http.HandleFunc("/public/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method Not Supported", http.StatusMethodNotAllowed)
			return
		}
		if _, ok := files[r.URL.Path]; !ok {
			http.Error(w, "File Not Exsit", http.StatusNotFound)
			return
		}

		f, err := os.Open("client" + r.URL.Path)
		defer f.Close()
		if err != nil {
			log.Fatal(err)
		}

		switch p := r.URL.Path; {
		case endsWith(p, ".js"):
			w.Header().Set("Content-Type", "text/javascript; charset=utf-8")
		case endsWith(p, ".css"):
			w.Header().Set("Content-Type", "text/css; charset=utf-8")
		case endsWith(p, ".jpg"):
			w.Header().Set("Content-Type", "image/jpeg; charset=utf-8")
		}

		_, err = io.Copy(w, f)
		if err != nil {
			http.Error(w, "Error", http.StatusInternalServerError)
		}
	})

	http.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" && r.URL.Path != "" {
			http.Error(rw, "Page Does Not Exsit", http.StatusNotFound)
			return
		}
		f, err := os.Open("client/public/index.html")
		defer f.Close()
		if err != nil {
			log.Fatal(err)
		}
		_, err = io.Copy(rw, f)
		if err != nil {
			log.Fatal(err)
		}
	})
}

func endsWith(s string, ending string) bool {
	return s[len(s)-len(ending):] == ending
}
