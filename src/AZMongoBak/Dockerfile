FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY AZMongoBak.csproj ./
RUN dotnet restore

# Install nodejs
RUN apt-get update
RUN apt-get install -y ca-certificates curl gnupg
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update
RUN apt-get install nodejs -y

COPY . /app/

# Update .ENVs
RUN rm -f /app/ClientApp/.env.dev
RUN rm -f /app/ClientApp/.env.local
RUN mv /app/ClientApp/.env.prod /app/ClientApp/.env

RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# Install additional dependencies (mongoshell)
RUN apt-get update
RUN apt-get install wget libgssapi-krb5-2 libkrb5-3 libk5crypto3 libkeyutils1 -y

RUN wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2204-arm64-100.9.4.deb
RUN dpkg -i ./mongodb-database-tools-ubuntu2204-arm64-100.9.4.deb

ENTRYPOINT ["dotnet", "AZMongoBak.dll"]