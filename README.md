# actio
Monitor GitHub Actions

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
