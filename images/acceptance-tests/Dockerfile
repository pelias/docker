# base image
FROM pelias/baseimage

# clone repo
RUN git clone https://github.com/pelias/acceptance-tests.git /code/pelias/acceptance-tests

# change working dir
WORKDIR /code/pelias/acceptance-tests

# consume the build variables
ARG REVISION=master

# switch to desired revision
RUN git checkout $REVISION

# install npm dependencies
RUN npm install