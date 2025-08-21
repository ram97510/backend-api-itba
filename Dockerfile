FROM timbru31/java-node
ENV PORT=5050
ENV JAVA_HOME=/opt/java/openjdk
WORKDIR /usr/src/app
####RUN apt-get update
####RUN apt install -y default-jre
# Install dependencies
COPY package.json /usr/src/app/
RUN npm install

# Copy source
COPY server.js /usr/src/app
COPY queries.js /usr/src/app

EXPOSE $PORT
CMD [ "npm", "start" ]
