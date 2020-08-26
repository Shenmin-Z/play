package webserver

import (
	"net/http"
)

func Serve() {
	static()
	generate()
	http.ListenAndServe(":3000", nil)
}
