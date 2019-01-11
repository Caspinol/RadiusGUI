# Simple freeRadius database management tool

> Allows for easy management of the freeRadius database

## Instalation

```bash
git clone https://github.com/Caspinol/RadiusGUI
cd RadiusGUI
npm run build
npm run start
```

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
```
