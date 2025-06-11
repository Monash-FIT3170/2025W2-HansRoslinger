FROM arm64v8/node:22-bookworm
USER root

# install our existing tools + canvas build deps
RUN apt update \
 && apt install -y \
      curl \
      ca-certificates \
      apt-transport-https \
      pkg-config \
      build-essential \
      libcairo2-dev \
      libpango1.0-dev \
      libjpeg-dev \
      libgif-dev \
      librsvg2-dev \
      fzf \
 && rm -rf /var/lib/apt/lists/*

# (…any additional repo setup for gh, if you still need it…)

# switch back to non-root
USER node
WORKDIR /home/node
