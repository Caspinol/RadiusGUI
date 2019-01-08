class Dashboard {

  static async showDashboard(conn) {
    // Get 5 guys with the most traffic
    const sql_top_traffic = 'SELECT ' +
      'radacctid,username,framedipaddress,acctinputoctets,acctoutputoctets ' +
      'FROM radacct ' +
      'where username!="" AND acctstoptime IS NULL AND acctsessiontime >0 ' +
      'ORDER BY acctsessiontime DESC LIMIT 5;';

    const sql_last_logins = 'SELECT * FROM radpostauth ORDER BY authdate DESC LIMIT 10;';

    const [big_traffic_users] = await conn.query(sql_top_traffic);
    const [last_logins] = await conn.query(sql_last_logins);

    return {
      last_logins,
      big_traffic_users
    }
  }
}

module.exports = Dashboard;
