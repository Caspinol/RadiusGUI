class Changelog {
  static async showLogs(
    conn,
    { page, size, sortBy, descending, searchString }
  ) {
    sortBy = sortBy || 'timestamp';
    const order = descending ? 'DESC' : 'ASC';
    let optionalSearch = '';
    if (searchString) {
      optionalSearch = ` WHERE timestamp LIKE '%${searchString}%' OR severity LIKE '%${searchString}%' OR message LIKE '%${searchString}%' `;
    }

    let offset = '';
    if (Number(size) >= 0) {
      offset += `LIMIT ${size} OFFSET ${(page - 1) * size}`;
    }

    let sql_list = `SELECT * FROM changelog ${optionalSearch} ORDER BY ${sortBy} ${order} ${offset};`;
    let sql_count = `SELECT COUNT(changelogid) as count FROM changelog ${optionalSearch};`;

    const [changelist] = await conn.query(sql_list);
    const [count] = await conn.query(sql_count);
    return {
      pageData: changelist,
      total_count: count[0].count,
    };
  }
}

module.exports = Changelog;
