class Dashboard {
  static async showDashboard(conn) {
    // Get 5 guys with the most traffic
    const sql_top_traffic =
      'SELECT ' +
      'radacctid,username,framedipaddress,acctinputoctets,acctoutputoctets ' +
      'FROM radacct ' +
      'where username!="" AND acctstoptime IS NULL AND acctsessiontime >0 ' +
      'ORDER BY acctsessiontime DESC LIMIT 5;';

    let btu = [];
    try {
      const [big_traffic_users] = await conn.query(sql_top_traffic);

      btu = big_traffic_users;
    } catch (err) {
      console.log(err);
    }
    return {
      big_traffic_users: btu,
    };
  }

  static async showLastLogins(conn, { page, rowsPerPage, sortBy, descending }) {
    sortBy = sortBy || 'username';
    const order = descending ? 'DESC' : 'ASC';

    let sql_pagesize = '';
    if (parseInt(rowsPerPage) > 0) {
      sql_pagesize = `LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage}`;
    }

    const sql_last_logins = `SELECT * FROM radpostauth ORDER BY ${sortBy} ${order} ${sql_pagesize}`;
    const sql_count = 'SELECT COUNT(*) as count FROM radpostauth;';

    const [logins] = await conn.query(sql_last_logins);
    const [count] = await conn.query(sql_count);
    return {
      logins,
      count: count[0].count,
    };
  }
}
module.exports = Dashboard;
