# Node-Green-Pass-Validator
This is my implementation of https://github.com/ministero-salute/dcc-utils

### Install
* clone project
* npm install dcc-utils

### Create Windows Service
* Edit service.js with the ServiceName you prefer and adjust the path to validator.js
* open cmd as Administrator into the project root and run "node service.js"

### Using
* when the service is running, post the barcode to serverurl:port/greenpass

*in this example the port was 8756*
