FROM node:22.8.0-slim
RUN npm install --global typescript@5.7.3 @types/node@22.8.0 \
    && tsc --version \
    && npm cache clean --force
