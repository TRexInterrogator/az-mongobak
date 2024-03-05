# Sample upgrade / deploy config using docker cli
# Note: Create network 'webapps_net' first to use this config
# Recommended: Deploy nginx reverse proxy in front of container

docker container stop azmongobak
docker container rm azmongobak

docker image rm az-mongobak

docker load -i az-mongobak.tar
docker run -d -p 7070:8080 --network webapps_net --restart unless-stopped --name azmongobak az-mongobak

echo "Upgrade done"