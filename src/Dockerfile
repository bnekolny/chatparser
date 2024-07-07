FROM golang:1.22-alpine AS builder
WORKDIR /app

# Install fresh for reloading
RUN go install github.com/pilu/fresh@latest

COPY go.mod .
# this happens during build, but separating it out allows it to cache
RUN go mod download

# Copy the rest of your application code
COPY . .

# Build the application with CGO disabled
RUN CGO_ENABLED=0 go build -o chatparser

FROM scratch
WORKDIR /app 

COPY --from=builder /app/chatparser /app/chatparser

CMD ["/app/chatparser"]
