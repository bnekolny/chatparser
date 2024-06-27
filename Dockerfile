FROM golang:1.22-alpine AS builder
WORKDIR /go/src/app  # Set working directory for building the application

# Install reflex
RUN apk add --no-cache git && \
    go install github.com/cespare/reflex@latest

COPY go.mod .
# this happens during build, but separating it out allows it to cache
RUN go mod download

# Copy the rest of your application code
COPY . .

# Build the application with CGO disabled
RUN CGO_ENABLED=0 go build -o chatparser ./main.go

FROM scratch
WORKDIR /go/src/app 

COPY --from=builder /go/bin/main /go/src/app/main

EXPOSE 8080  # Expose port 8080 for the server
CMD ["/go/src/app/chatparser"]
