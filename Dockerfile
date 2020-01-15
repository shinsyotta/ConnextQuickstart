# Use node 12.13
FROM node:12.13.0-alpine3.10

# Use /root as our default working directory
WORKDIR /root
ENV HOME /root

# Install core build tools required to compile C
RUN apk add --update --no-cache bash curl g++ gcc git jq make python

# Update & config npm to work w docker
RUN npm config set unsafe-perm true
RUN npm install -g npm@6.12.0

# Install node_modules
COPY package.json package.json
RUN npm install

# Copy source files into our docker container
COPY src src

# Command to run first thing when this docker container wakes up
ENTRYPOINT ["npm", "start"]
