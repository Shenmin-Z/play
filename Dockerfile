FROM golang:alpine AS builder

WORKDIR /build

COPY go.mod .
COPY go.sum .
COPY cmd/ cmd/
COPY pkg/ pkg/

# https://www.arp242.net/static-go.html
RUN go build -tags osusergo,netgo -o main ./cmd/draw/main.go

#####

FROM scratch

WORKDIR /dist

COPY --from=builder /build/main .

COPY static/ static/
COPY client/public/ client/public/

ENV app_version=1.0.2

EXPOSE 3000
ENTRYPOINT ["/dist/main"]
