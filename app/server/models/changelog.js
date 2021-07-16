class Changelog {
  static async showLogs(
    conn,
    { page, rowsPerPage, sortBy, sortDesc, searchString }
  ) {
    sortBy = sortBy[0] || 'timestamp';
    const order = sortDesc[0] ? 'ASC' : 'DESC';
    let optionalSearch = '';
    if (searchString) {
      optionalSearch = ` WHERE timestamp LIKE '%${searchString}%' OR severity LIKE '%${searchString}%' OR message LIKE '%${searchString}%' `;
    }

    let offset = '';
    if (Number(rowsPerPage) >= 0) {
      offset += `LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage}`;
    }

    let sql_list = `SELECT * FROM changelog ${optionalSearch} ORDER BY ${sortBy} ${order} ${offset};`;
    let sql_count = `SELECT COUNT(changelogid) as count FROM changelog ${optionalSearch};`;
    console.log(sql_list);
    const [changelist] = await conn.query(sql_list);
    const [count] = await conn.query(sql_count);
    return {
      pageData: changelist,
      total_count: count[0].count,
    };
  }
}

module.exports = Changelog;
