FROM node:10-alpine

WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN yarn

# Copy rest of the application csource code
COPY . .

# Build Typescript
RUN chmod a+x ./node_modules/.bin/tsc
RUN yarn tsc -v
RUN yarn tsc

# Run api
ENTRYPOINT ["node", "./dist/src/index.js"]





