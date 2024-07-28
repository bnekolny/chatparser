FROM node:22-alpine3.18 AS staticbuilder
# was node:22-alpine, but alpine broke things
# https://github.com/docker-library/official-images/issues/16830
RUN corepack enable && yarn set version berry
WORKDIR /srv/app
COPY web/package.json ./
COPY web/yarn.lock ./
RUN yarn install
COPY web /srv/app
RUN yarn run build

FROM golang:1.22-alpine AS gobuilder
WORKDIR /app
# Install fresh for reloading
RUN go install github.com/pilu/fresh@latest
# put this lower so it can cache better
RUN apk --no-cache add ca-certificates

# This has to go here, not in the final container because the static embed is loaded at compile time
COPY --from=staticbuilder /srv/app/dist /app/static

COPY go.mod .
# this happens during build, but separating it out allows it to cache
RUN go mod download
# Copy the rest of your application code
COPY . .
# Build the application with CGO disabled
RUN CGO_ENABLED=0 go build -o chatparser

FROM alpine as shell
WORKDIR /app
COPY --from=gobuilder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=gobuilder /app/chatparser /app/chatparser
COPY --from=staticbuilder /srv/app/dist /app/static
CMD ["sh"]

FROM scratch as release
# Not super helpful without the COPY below, because it's not needed at this stage
#FROM alpine as release
WORKDIR /app 
COPY --from=gobuilder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=gobuilder /app/chatparser /app/chatparser
# Can't go here with //go:embed static/* as the embed is loaded at build time
#COPY --from=staticbuilder /srv/app/dist /app/static
CMD ["/app/chatparser"]
