const logger = require('../lib/logging');

export default class Nas {
  static async showNaslist(
    conn,
    { page, rowsPerPage, sortBy, sortDesc, searchString }
  ) {
    sortBy = sortBy[0] || 'nasname';
    const order = sortDesc[0] ? 'ASC' : 'DESC';

    let optionalSearch = '';
    if (searchString) {
      optionalSearch = ` WHERE nasname LIKE '%${searchString}%' OR shortname LIKE '%${searchString}%' OR description LIKE '%${searchString}%' OR type LIKE '%${searchString}%' `;
    }

    let sql_nas = `SELECT * FROM nas ${optionalSearch} ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?;`;
    let sql_count = `SELECT COUNT(id) as count FROM nas;`;

    const [nasList] = await conn.query(sql_nas, [
      rowsPerPage,
      (page - 1) * rowsPerPage,
    ]);
    const [count] = await conn.query(sql_count);
    return {
      nasList,
      count: count[0].count,
    };
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
      server,
    } = nas;
    const sql_insert =
      'INSERT INTO nas(nasname, shortname, type, ports, secret, server, community, description) VALUES(?,?,?,?,?,?,?,?);';

    logger.log('changelog', {
      message: `Adding new NAS device: ${JSON.stringify(nas)}`,
    });

    await conn.query(sql_insert, [
      nasname,
      shortname,
      type,
      ports,
      secret,
      server,
      community,
      description,
    ]);

    logger.log('changelog', {
      message: `NAS (${nasname}) added.`,
    });
  }

  static async updateNas(
    conn,
    { nasname, shortname, type, secret, ports, description, community, server }
  ) {
    const sql_update =
      'UPDATE nas SET shortname =?, type=?, ports=?, secret=?, server=?, community=?, description=? WHERE nasname=?';

    logger.log('changelog', {
      message: `Updating NAS(${nasname}) with: ${JSON.stringify({
        shortname,
        type,
        secret,
        ports,
        description,
        community,
        server,
      })}`,
    });

    await conn.query(sql_update, [
      shortname,
      type,
      ports,
      secret,
      server,
      community,
      description,
      nasname,
    ]);
    logger.log('changelog', {
      message: 'NAS updated.',
    });
  }

  static async deleteNas(conn, nas) {
    const sql_delete = `DELETE FROM nas WHERE id = ${nas.id}`;
    logger.log('changelog', {
      message: `Deleting NAS: ${nas.nasname}.`,
    });
    try {
      await conn.query(sql_delete);
    } catch (err) {
      console.log(err);
    }
    logger.log('changelog', {
      message: `NAS: ${nas.nasname} has been deleted.`,
    });
    return;
  }
}
