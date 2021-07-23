const winston = require('winston');
const Transport = require('winston-transport');
const mysql = require('mysql2');

// The changelog will store in db only the logs related to modyfying the DB content
// user CRUD, profile CRUD, etc..
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5,
  changelog: 6,
};

class MySQLTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    this.name = 'changelog';
  }

  log(info, callback) {
    const self = this;
    /* Perform the database write only for changelog severity */
    if (info.level === 'changelog') {
      this.pool.getConnection((err, connection) => {
        if (err) {
          console.error('Getting connection ', err);
          self.emit(
            'error',
            'Failed obtain database connection for changelog.'
          );
        }
        connection.query(
          'INSERT INTO changelog(timestamp, severity, message) VALUES(NOW(),?,?)',
          [info.level, info.message],
          (err) => {
            if (err) {
              self.emit(
                'error',
                'Failed to write changelog to database. Error: ',
                err
              );
            }
            connection.release();
          }
        );
      });
    }
    if (callback && typeof callback === 'function') {
      callback();
    }
  }
}

const logger = winston.createLogger({
  levels: levels,
  transports: [
    /** Log everything to the console */
    new winston.transports.Console({
      level: 'changelog',
      handleExceptions: true,
    }),
    /** Log level determined with a config file */
    new winston.transports.File({
      filename: `${process.env.LOG_DIR}/${process.env.LOG_FILE}`,
      level: process.env.LOG_SEVERITY,
      handleExceptions: true,
    }),
    /** Custom transport - log only the specified severity */
    new MySQLTransport({
      level: 'changelog',
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
