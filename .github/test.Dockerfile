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
RUN groupadd -r testuser && useradd --no-log-init -r -g testuser testuser

FROM scratch
COPY --from=build /etc/passwd /etc/group /etc/
COPY --from=build /bin/hello /hello
USER testuser
HEALTHCHECK NONE
CMD ["/hello"]
