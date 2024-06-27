# chatparser
WhatsApp chat parser to give feedback on language development

running locally
```
dc up
```

testing locally
```
$ curl -X POST -H "Content-Type: text/plain" --data-binary @samplechat.txt localhost:8080/chat
```
