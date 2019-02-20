const proc = require('../lib/process');

class Utils {
  static async getServerStatus() {
    return {
      isRunning: await proc.isRunning('radiusd'),
    };
  }

  static async getDbStatus(conn) {
    return {
      isRunning: await conn.query('SELECT user()'),
    };
  }

  static async getPools(conn) {
    const sql_query = `SELECT  pool_name, SUM( CASE WHEN t.username <>'' THEN 1 ELSE 0 END) AS used, SUM( CASE WHEN t.username = '' then 1 else 0 end) as free FROM radius.radippool t where pool_name like '%_Dynamic' group by pool_name`;

    const [pools] = await conn.query(sql_query);
    return {
      pools,
    };
  }
}

module.exports = Utils;
