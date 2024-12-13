FROM node:16

RUN apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common \
    gnupg2 \
    lsb-release \
    && curl -fsSL https://get.docker.com | sh \
    && apt-get install -y docker-ce docker-ce-cli containerd.io \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
