# actio
![CI](https://github.com/fortis-it-services/actio/actions/workflows/main.yaml/badge.svg?event=push)
![License](https://img.shields.io/github/license/fortis-it-services/actio)

Monitor your GitHub Actions workflow runs! All you need is your [PAT](#github-personal-access-token).

![actio example](img/actio.png?raw=true)

## Features
* Retrieve repositories by team membership
* Display last workflow run status for every repository/branch combination
* Filter displayed workflow runs by
  * maximum age (default 14 days)
  * team,
  * status (e.g. queued, in progress, …) and
  * conclusion (e.g. success, failure, …)
  * workflow names (case-insensitive, substring)
* Polling for new
  * repositories,
  * branches,
  * workflows and
  * workflow runs

## Local Usage
If you want to try actio on your machine run
```shell
docker run --rm --pull=always -p 8080:80 ghcr.io/fortis-it-services/actio
```
to always update automatically to the latest release or
```shell
docker run --rm -p 8080:80 ghcr.io/fortis-it-services/actio:${MY_DESIRED_VERSION}
```
to stick to a specific release.

After that you can access actio via <http://localhost:8080>.

## GitHub Personal Access Token
At minimum, the following scopes needs to be [configured](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for your personal access token:
- repo
- read:org

If your organization is using SSO, you need to [authorize](https://docs.github.com/en/enterprise-cloud@latest/authentication/authenticating-with-saml-single-sign-on/authorizing-a-personal-access-token-for-use-with-saml-single-sign-on) your token.
