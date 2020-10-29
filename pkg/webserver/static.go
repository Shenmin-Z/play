package webserver

import (
	"io"
	"log"
	"net/http"
	"os"
	"strings"
)

// Serve static files
func static() {
	appVersion, exist := os.LookupEnv("app_version")
	if !exist {
		appVersion = "development-mode"
	}

	http.HandleFunc("/public/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method Not Supported", http.StatusMethodNotAllowed)
			return
		}
		if _, err := os.Stat("client" + r.URL.Path); os.IsNotExist(err) {
			http.Error(w, "File Not Exsit", http.StatusNotFound)
			return
		}

		f, err := os.Open("client" + r.URL.Path)
		defer f.Close()
		if err != nil {
			log.Fatal(err)
		}

		if etag := r.Header.Get("If-None-Match"); strings.Contains(etag, appVersion) {
			w.WriteHeader(http.StatusNotModified)
			return
		}
		w.Header().Set("Etag", `"`+appVersion+`"`)

		switch p := r.URL.Path; {
		case endsWith(p, ".js"):
			w.Header().Set("Content-Type", "text/javascript; charset=utf-8")
			if !exist {
				w.Header().Del("Etag")
			}
		case endsWith(p, ".map"):
			w.Header().Del("Etag")
		case endsWith(p, ".css"):
			w.Header().Set("Content-Type", "text/css; charset=utf-8")
		}

		_, err = io.Copy(w, f)
		if err != nil {
			http.Error(w, "Error", http.StatusInternalServerError)
		}
	})

	http.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
		path := r.URL.Path

		var filePath string
		if path == "/" || path == "" {
			filePath = "client/public/index.html"
		} else if strings.Contains(path, "favicon.ico") {
			filePath = "client/public/favicon.png"
		} else {
			http.Error(rw, "Page Does Not Exsit", http.StatusNotFound)
			return
		}

		if etag := r.Header.Get("If-None-Match"); strings.Contains(etag, appVersion) {
			rw.WriteHeader(http.StatusNotModified)
			return
		}
		rw.Header().Set("Etag", `"`+appVersion+`"`)

		f, err := os.Open(filePath)
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
