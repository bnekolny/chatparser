# chatparser

This app exists as a tool for language development. While there are many apps for language "learning" out there, I wanted to build something that would solve a number of pain points I have during day-to-day interactions in a new language.

A few use-cases:
- "dictionary-like" capabilities for new words and coloquial prases.
- "message-checker" tools that can give feedback on a composed message.
- **[To Be Developed]** "learning over time" features tied to your user, reading chat messages (i.e. WhatsApp, Telegram) and providing guidance on  how to improve your language skills.

## Development
### Local
> NOTE: requires a US VPN for Gemini API key

#### Setup Steps
1. Create env ```cp .env.sample .env```
1. Install mkcert
    1. mac via `brew install mkcert`
    1. windows via https://github.com/FiloSottile/mkcert/releases
1. Generate certificates ```mkcert -key-file src/.cert/key.pem -cert-file src/.cert/cert.pem 'local.chatparser.xyz'```
-----------------------------------
#### Local Development
1. Boot the app ```docker compose up```
1. Visit https://local.chatparser.xyz
1. Visit https://local.chatparser.xyz/static/pages/dict.html
1. To add packages
    1. Installing golang packages: `docker compose run golang sh -c "go get {package}"`
    1. Installing node packages: `docker compose run vite sh -c "yarn add {package}"`
<details>
<summary>[optional] install gcloud</summary>

https://cloud.google.com/sdk/docs/install#linux

```
gcloud auth login
gcloud config set project chatparser
```
</details>

## Deployed Environments
Deployments to the cloud occur by pushing to the respective branches, CI/CD is handled by Google Cloud Build.

#### production (`main`)
Deploying to production should be done easily, but "verification" of CI/CD steps is required, note the "checks" in `cloudbuild/`. These checks must pass before deployment: `build`, `test`, `validate`, `security`.
- https://app.chatparser.xyz
- https://app.chatparser.xyz/dict

#### test (`test`)
Deploying to test should be done with ease for testing purposes, a broken test environment is not a concern. Passing "checks" are not required before deployment.
- https://test.chatparser.xyz
- https://test.chatparser.xyz/dict
