# Simple freeRadius database management tool

> Allows for easy management of the freeRadius database

## Instalation

### For local usage:
```bash
git clone https://github.com/VersBinarii/RadiusGUI
cd RadiusGUI/app
npm run build
npm run start
```

### Using docker

``` bash
git clone https://github.com/VersBinarii/RadiusGUI
cd RadiusGUI/
docker-compose up --build -d
```

Please make sure the configuration items are set correctly. See below.


## Configuration

The server expects RadiusGUI.env file in the root directory with the following variables:

```bash
DB_HOST=<db host>
DB_PORT=3306
DB_USER=<radiusdbuser>
DB_PASS=<radiusdbpassword>
DB_NAME=<radius>

LOG_DIR=<path to log directory>
LOG_FILE=<log file name>
LOG_SEVERITY=<severity level>

HOST=0.0.0.0
PORT=3000
```

Also edit the `nuxt.config.js` file and set the 

```javascript
axios:{
	baseURL: <host>/api
}
```

`


## Notes
 - This frontend is build around my particular use case with my particular database schema changes. The schema for this version can be seen in the `server/schema` directory. It should be relatively easy to trim this to any other use case.
- The only supported database so far is MySQL.
