# Bitfrog
> *Notifications made easy*
> 
> [`Python API`](https://github.com/bitfrog-dev/bitfrog-python)
> [`CLI tool`](https://github.com/bitfrog-dev/bitfrog-cli)

This is by far my most ambitious project to date, it is a full-stack mobile app that allows you to send notifications from your code with a simple API. The backend uses TypeScript with a MySQL database and Redis cache, all split into several independant modules for easy horizontal scaling. The frontend is writen in React Native (my first time using React at all) and uses Expo for easier development.

The app features JWT euthentication, token based API, password resetting, per-project rate limiting, IAP and Firebase notifications (through Expo), Websocket update streaming, modular "channels" for organization, collaborative projects, a REST API, a Python API, a CLI tool (written in Rust), and more.

The whole project was made in roughly 3 months but setting up the app store page took significantly longer. Unfortunately, I can't make the backend or mobile code public (at least not yet) for security reasons, but the code that I can open source is listed above.