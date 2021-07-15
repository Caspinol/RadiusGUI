class Accounting {
  static async showAccounting(
    conn,
    { page, rowsPerPage, sortBy, sortDesc, searchString }
  ) {
    sortBy = sortBy[0] || 'username';
    const order = sortDesc ? 'ASC' : 'DESC';
    let optionalSearch = '';
    if (searchString) {
      optionalSearch = ` AND (acctsessionid LIKE '%${searchString}%' OR username LIKE '%${searchString}%' OR nasipaddress LIKE '%${searchString}%' OR nasporttype LIKE '%${searchString}%' OR acctstarttime LIKE '%${searchString}%' OR acctstoptime LIKE '%${searchString}%' OR framedipaddress LIKE '%${searchString}%' OR framedipv6address LIKE '%${searchString}%' OR clientmac LIKE '%${searchString}%' OR clientvendor LIKE '%${searchString}%' OR slaprofile LIKE '%${searchString}%' OR subscprofile LIKE '%${searchString}%' OR  callingstationid LIKE '%${searchString}%') `;
    }

    let sql_pagesize = '';
    if (Number(rowsPerPage) > 0) {
      sql_pagesize = `LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage}`;
    }
    // We want username != '' so we can filter out the empty accounting entries
    let sql_accounts = `SELECT * FROM radacct WHERE username != '' ${optionalSearch}  ORDER BY ${sortBy} ${order} ${sql_pagesize};`;
    let sql_count = `SELECT COUNT(radacctid) as count FROM radacct WHERE username != '' ${optionalSearch};`;

    const [accounting] = await conn.query(sql_accounts);
    const [count] = await conn.query(sql_count);
    return {
      pageData: accounting,
      total_count: count[0].count,
    };
  }
}

module.exports = Accounting;
