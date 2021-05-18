# ----------------------------------------------------
# ------------- Dashboard-PWA Dockerfile -------------
# ----------------------------------------------------
# Version: 0.9 (2021-05-18)
# Author: Nils Höll <nils.hoell@stud.uni-due.de>

FROM node:lts-buster

LABEL version="0.9"
LABEL maintainer="Nils Höll <nils.hoell@stud.uni-due.de>"
LABEL description="Creates a docker image with a production build of the Dashboard-PWA."

# Copy all files (excl. .dockerignore) to the workdir
WORKDIR /usr/src/app
COPY . .

# Install dependencies
RUN apt update && apt full-upgrade -y

# Install dependencies
RUN npm install

# Run the production build process
RUN npm run build
EXPOSE 3000

# Start the node server
CMD ["node", "dist/server.js"]