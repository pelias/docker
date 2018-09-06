
HTTP debugging proxy

## Usage

```yaml
  debugproxy:
    image: pelias/debug-proxy:latest
    container_name: debugproxy
    restart: always
    environment: [ "HOST=placeholder", "PORT=4100" ]
    ports: [ "8000:8000" ]
```

## Rebuild image

```bash
docker build -t pelias/debug-proxy .
```

## Credit

Source code copied from:
https://github.com/acroca/http-docker-debug-proxy
