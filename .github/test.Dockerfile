# syntax=docker/dockerfile:1
FROM golang:1.21 AS build
WORKDIR /src
COPY <<EOF ./main.go
package main

import "fmt"

func main() {
  fmt.Println("hello, world")
}
EOF

RUN go build -o /bin/hello ./main.go

FROM scratch
COPY --from=build /bin/hello /hello
CMD ["/hello"]
