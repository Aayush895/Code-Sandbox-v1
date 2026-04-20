FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive

RUN useradd -ms /bin/bash sandbox
WORKDIR /home/sandbox

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y nano curl ca-certificates build-essential && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update && apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN npm install -g nodemon vite concurrently

RUN echo "PS1='\w \$ '" >> /home/sandbox/.bashrc

WORKDIR /home/sandbox/app
USER sandbox

CMD mkdir -p "$UNIQUE_ID" && \
    echo "cd /home/sandbox/app/$UNIQUE_ID" >> /home/sandbox/.bashrc && \
    exec bash