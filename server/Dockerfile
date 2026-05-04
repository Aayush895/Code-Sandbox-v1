FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Create user
RUN useradd -ms /bin/bash sandbox

WORKDIR /home/sandbox

# Update + install packages
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y nano curl ca-certificates && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update && apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Add custom PS1
RUN echo "PS1='\w '" >> /home/sandbox/.bashrc

# Final working directory
WORKDIR /home/sandbox/app