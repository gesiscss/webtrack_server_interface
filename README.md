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
  "development": false,
  "developmentTraget": {
    "protocol": "https://",
    "url": "webtrack.example.net",
    "port": "8443"
  }
}
```
## Getting started
- Clone this repo
- `npm install` to install all req'd dependencies
- `npm run start` to start the local server (this project uses create-react-app)
