const logger = require('../lib/logging');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

export default class Login {
  static async login(conn, { username, password }) {
    const sql_get_user = 'SELECT * FROM login WHERE username = ?';

    try {
      const [login] = await conn.query(sql_get_user, [username]);

      console.log(login[0]);

      const match = await bcrypt.compare(password, login[0].password);
      if (match) {
        return {
          code: 200,
          user: login[0],
        };
      }
    } catch (e) {
      console.error(e);
    }
    return {
      code: 401,
      message: 'Authentication failed',
    };
  }

  static async register(conn, user) {
    const hashed_password = await bcrypt.hash(user.password, SALT_ROUNDS);
    const sql_sing_in = 'INSERT INTO login (username, password) VALUES (?,?);';
    try {
      await conn.query(sql_sing_in, [user.username, hashed_password]);
      logger.log('changelog', {
        message: `User ${user.username} has been created.`,
      });
    } catch (e) {
      console.error(e);
    }
  }

  static async getLogins(conn) {
    const sql_get_logins = 'SELECT * FROM login ORDER BY userid';
    try {
      const [logins] = await conn.query(sql_get_logins);
      console.log(logins);
      return {
        logins,
      };
    } catch (e) {
      console.error(e);
    }
  }
}
