FROM node:18.3.0

WORKDIR /usr/src/app

# Install app dependencies
COPY ./package*.json ./

RUN npm install
RUN npm i nodemon

COPY ./ /usr/src/app/
EXPOSE 4444

CMD ["node ", "app.js" ]