# chatparser
WhatsApp chat parser to give feedback on language development.

First step is to get the local development environment going
1. Install gcloud: https://cloud.google.com/sdk/docs/install#linux
2. `gcloud auth login`
3. create .env
```
PORT=8080
GEMINI_API_KEY=
IMPERSONATE_SERVICE_ACCOUNT=fake@email.com
```
get the gemini API key here: https://console.cloud.google.com/security/secret-manager/secret/GEMINI_API_KEY/versions?project=chatparser

TODO:
- manual `npm install` was required
- mkcert https://github.com/FiloSottile/mkcert/releases

NOTE: requires a US VPN

running locally
```
dc up
```

testing locally via web:
https://local.chatparser.xyz

There are also APIs to access:
```
$ curl -X POST -H "Content-Type: text/plain" --data-binary @samplechat.txt localhost:8080/api/chat
```
