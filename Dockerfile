# How to use docker to run short-jsdoc development environment

# cd short-jsdoc
# docker build -t short-jsdoc .
# 
# For executing an interactive command line:
# docker run -p 8080:8080 --mount type=bind,source="$(pwd)",target=/frontend -ti short-jsdoc /bin/sh
# 
# For executing grunt run directly:
# docker run -p 8080:8080 --mount type=bind,source="$(pwd)",target=/frontend short-jsdoc grunt run
# 
# That last command will run grunt run in the docker synchronizing files so you can use your host preferred text editor and browser. 
# to stop all docker containers - after you finish working - execute: 
#
# docker stop $(docker ps -a -q)
#
# for removing all docker images use:
#
# docker rmi $(docker images -q) --force


FROM node:6.11.4-alpine

RUN mkdir -p /frontend
WORKDIR /frontend
COPY ./ ./

RUN npm install -g grunt-cli
RUN npm install
