This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

# Webtrack-Admin-Interface
This project is tailored to the web interface of the Webtrack API.
## Preparation

To specify the project name or a specific API server, configuration file settings are necessary. This setting must be made in "src/defined/config.json".
```json
{
  "projectName": "WebTrack",
  "development": true,
  "developmentTraget": {
    "protocol": "https://",
    "url": "localhost",
    "port": "8443"
  }
}
```
## Getting started

1. Clone this repo

2. `npm install` to install all req'd dependencies

3. Make sure that the webtrack_server is running

4. `npm run start` to start the local server (this project uses create-react-app)

## Create build

1. Change the development flag to `false` (I am not sure if this is necessary)

```json
{
  "projectName": "WebTrack",
  "development": false,
  "developmentTraget": {
    "protocol": "https://",
    "url": "localhost",
    "port": "8443"
  }
}
```

2. Build it!

```
npm run build
```