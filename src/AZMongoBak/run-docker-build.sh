# /bin/bash
docker build -t az-mongobak .
docker save -o az-mongobak.tar az-mongobak:latest