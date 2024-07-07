FROM golang:1.22-alpine AS builder
WORKDIR /app

# Install fresh for reloading
RUN go install github.com/pilu/fresh@latest

COPY go.mod .
# this happens during build, but separating it out allows it to cache
RUN go mod download

# Copy the rest of your application code
COPY . .

# put this lower so it can cache better
RUN apk --no-cache add ca-certificates

# Build the application with CGO disabled
RUN CGO_ENABLED=0 go build -o chatparser

FROM scratch
WORKDIR /app 

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app/chatparser /app/chatparser

CMD ["/app/chatparser"]
