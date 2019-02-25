const logger = require('../lib/logging');

class Nas {

  static async showNaslist(conn, {
    page,
    size,
    sortBy,
    descending,
    searchString
  }) {
    sortBy = sortBy || 'nasname';
    const order = descending ? 'DESC' : 'ASC';
    let optionalSearch = '';
    if (searchString) {
      optionalSearch = ` WHERE nasname LIKE '%${searchString}%' OR shortname LIKE '%${searchString}%' OR description LIKE '%${searchString}%' OR type LIKE '%${searchString}%' `;
    }

    let sql_nas = `SELECT * FROM nas ${optionalSearch} ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?;`;
    let sql_count = `SELECT COUNT(id) as count FROM nas;`;

    const [naslist] = await conn.query(sql_nas, [size, (page - 1) * size]);
    const [count] = await conn.query(sql_count);
    return {
      pageData: naslist,
      total_count: count[0].count,
    }
  }

  static async saveNas(conn, nas) {

    const {
      nasname,
      shortname,
      type,
      secret,
      ports,
      description,
      community,
      server
    } = nas;
    const sql_insert = "INSERT INTO nas(nasname, shortname, type, ports, secret, server, community, description) VALUES(?,?,?,?,?,?,?,?);"

    logger.log('changelog', {
      message: `Adding new NAS device: ${JSON.stringify(nas)}`
    });

    await conn.query(sql_insert, [nasname, shortname, type, ports, secret, server, community, description]);

    logger.log('changelog', {
      message: `NAS (${nasname}) added.`
    });

  }

  static async updateNas(conn, {
    nasname,
    shortname,
    type,
    secret,
    ports,
    description,
    community,
    server
  }) {

    const sql_update = 'UPDATE nas SET shortname =?, type=?, ports=?, secret=?, server=?, community=?, description=? WHERE nasname=?';

    logger.log('changelog', {
      message: `Updating NAS(${nasname}) with: ${JSON.stringify({
        shortname,
        type,
        secret,
        ports,
        description,
        community,
        server})}`
    });

    await conn.query(sql_update, [shortname, type, ports, secret, server, community, description, nasname]);
    logger.log('changelog', {
      message: 'NAS updated.'
    });
  }
}

module.exports = Nas;
