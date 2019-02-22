const proc = require('../lib/process');
const os = require('os');

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

  static async getHostStats() {
    return {
      totalMem: formatInMb(os.totalmem()),
      freeMem: formatInMb(os.freemem()),
      uptime: formatTime(os.uptime()),
    };
  }
}

function formatInMb(size) {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
  return Math.round(size / Math.pow(1024, i), 2) + ' ' + units[i];
}

function formatTime(s) {
  const ss = parseInt(s, 10);
  const days = Math.floor(ss / 86400);
  const days_i = days * 86400;
  const hours = Math.floor((ss - days_i) / 3600);
  const hours_i = hours * 3600;
  const minutes = Math.floor((ss - days_i - hours_i) / 60);
  const minutes_i = minutes * 60;
  const seconds = ss - days_i - hours_i - minutes_i;

  return `${days} days ${hours < 10 ? '0' + hours : hours}:
${minutes < 10 ? '0' + minutes : minutes}:
${seconds < 10 ? '0' + seconds : seconds}`;
}

module.exports = Utils;
