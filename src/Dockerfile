FROM golang:1.22-alpine AS gobuilder
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

FROM node:22-alpine AS staticbuilder
WORKDIR /srv/app

COPY web /srv/app

RUN npm run build

#FROM scratch as release
FROM alpine as release
WORKDIR /app 

COPY --from=gobuilder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=gobuilder /app/chatparser /app/chatparser
COPY --from=staticbuilder /srv/app/dist /app/static

CMD ["/app/chatparser"]
