class Dashboard {
  static async showDashboard(conn) {
    // Get 5 guys with the most traffic
    const sql_top_traffic =
      'SELECT ' +
      'radacctid,username,framedipaddress,acctinputoctets,acctoutputoctets ' +
      'FROM radacct ' +
      'where username!="" AND acctstoptime IS NULL AND acctsessiontime >0 ' +
      'ORDER BY acctsessiontime DESC LIMIT 5;';

    const sql_last_logins =
      'SELECT * FROM radpostauth ORDER BY authdate DESC LIMIT 10;';

    let ll = [];
    let btu = [];
    try {
      const [big_traffic_users] = await conn.query(sql_top_traffic);
      const [last_logins] = await conn.query(sql_last_logins);
      ll = last_logins;
      btu = big_traffic_users;
    } catch (err) {
      console.log('Dash server: ', err);
    }
    return {
      last_logins: ll,
      big_traffic_users: btu,
    };
  }
}

module.exports = Dashboard;
