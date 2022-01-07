# actio
![CI](https://github.com/fortis-it-services/actio/actions/workflows/main.yaml/badge.svg?event=push)
![License](https://img.shields.io/github/license/fortis-it-services/actio)

Monitor GitHub Actions

![actio example](img/actio.png?raw=true)

## GitHub Personal Access Token
At minimum, the following scopes needs to be [configured](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for your personal access token:
- repo
- read:org

If your organization is using SSO, you need to [authorize](https://docs.github.com/en/enterprise-cloud@latest/authentication/authenticating-with-saml-single-sign-on/authorizing-a-personal-access-token-for-use-with-saml-single-sign-on) your token. 

## Local Usage
If you want to try actio on your machine clone this repository and run
```shell
docker build -t actio -f docker/Dockerfile .
```
to build your own copy of actio and use
```shell
docker run --rm -p 8080:80 actio
```
to access it via <http://localhost:8080>.
