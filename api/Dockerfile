FROM hypriot/rpi-node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install --production

EXPOSE 3000
CMD ["npm", "start"]
