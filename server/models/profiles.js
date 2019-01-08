class Profiles {
  static async listProfiles(conn, {
    sortBy,
    descending,
  }) {
    sortBy = sortBy || 'groupname';
    const order = descending ? 'DESC' : 'ASC';

    let sql = `SELECT groupname, (SELECT count(username) FROM radusergroup as rug WHERE rug.groupname = rgr.groupname) as count FROM radius.radgroupreply as rgr GROUP BY groupname ORDER BY ${sortBy} ${order};`;

    const [data] = await conn.query(sql);
    return {
      pageData: data,
    }
  }

  static async saveProfile(conn, {
    name,
    rows
  }) {

    let sql_insert = 'INSERT INTO radgroupreply (groupname, attribute, op, value) VALUES ';
    // Fields are sent as array af values
    for (let i = 0; i < rows.length; i++) {
      sql_insert += `(${conn.escape(name)}, ${conn.escape(rows[i].attribute)}, ${conn.escape(rows[i].op)}, ${conn.escape(rows[i].value)}),`;
    }
    // remove last comma
    sql_insert = sql_insert.slice(0, -1);

    await Profiles.deleteProfile(conn, {
      name
    });
    await conn.query(sql_insert);
  }

  static async deleteProfile(conn, {
    name
  }) {
    let sql_delete = 'DELETE FROM radgroupreply WHERE groupname=?';
    await conn.query(sql_delete, [name]);
  }

  static async getProfile(conn, {
    name
  }) {
    const sql = 'SELECT * FROM radgroupreply WHERE groupname=?';

    const [profile] = await conn.query(sql, [name]);
    return {
      pageData: profile
    }
  }
}

module.exports = Profiles;
