const logger = require('../lib/logging');

class Users {
  static async usersPage(
    conn,
    { page, rowsPerPage, sortBy, descending, searchString }
  ) {
    // We need to obtain Username, Password, Profile, and all address pools
    sortBy = sortBy || 'username';
    const order = descending ? 'DESC' : 'ASC';

    let optionalSearch = '';
    if (searchString) {
      optionalSearch = `AND (rc.username LIKE '%${searchString}%' OR groupname LIKE '%${searchString}%' OR ipv4_pool_name LIKE '%${searchString}%' OR ipv6_dp_pool_name LIKE '%${searchString}%' OR  ipv6_nt_pool_name LIKE '%${searchString}%') `;
    }

    let sql_pagesize = '';
    if (Number(rowsPerPage) > 0) {
      sql_pagesize = `LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage}`;
    }

    const sql_users =
      'SELECT rug.username, rc.value, groupname, ipv4_pool_name, ipv6_dp_pool_name, ipv6_nt_pool_name, created_at ' +
      'FROM radusergroup as rug ' +
      'JOIN radcheck as rc ' +
      'WHERE rc.username = rug.username ' +
      ` ${optionalSearch} ` +
      `ORDER BY rug.${sortBy} ${order} ${sql_pagesize};`;

    const sql_count =
      `SELECT COUNT(rc.username) as count FROM radusergroup AS rug ` +
      `JOIN radcheck AS rc WHERE rc.username = rug.username ${optionalSearch};`;
    const [count] = await conn.query(sql_count);
    const [users] = await conn.query(sql_users);
    return {
      total_count: count[0].count,
      pageData: users,
    };
  }

  static async userSettings(conn) {
    const [profiles] = await get_profile_list(conn);
    const [ip4Pools] = await get_ip4Pools(conn);
    const [ip6PDPools] = await get_ip6PDPools(conn);
    const [ip6NTPools] = await get_ip6NTPools(conn);

    return {
      profiles,
      ip4Pools,
      ip6PDPools,
      ip6NTPools,
    };
  }

  static async storeUser(conn, user) {
    let sql_delete =
      'DELETE radcheck, radusergroup FROM radcheck INNER JOIN radusergroup WHERE radcheck.username = radusergroup.username AND radcheck.username = ?;';

    let sql_insert =
      'BEGIN;' +
      'INSERT INTO radcheck(username, value) ' +
      'VALUES(?, ?);' +
      'INSERT INTO ' +
      'radusergroup(username, groupname, ipv4_pool_name, ipv6_dp_pool_name, ipv6_nt_pool_name)' +
      'VALUES(?, ?, ?, ?, ?);' +
      'COMMIT;';

    logger.log('changelog', {
      message: `Storing user: ${JSON.stringify(user)}`,
    });
    user = Object.assign(
      {
        username: '',
        groupname: 'none',
        ipv4_pool_name: 'none',
        ipv6_dp_pool_name: 'none',
        ipv6_nt_pool_name: 'none',
      },
      user
    );

    try {
      await conn.query(sql_delete, [user.username]);
      await conn.query(sql_insert, [
        user.username,
        user.value,
        user.username,
        user.groupname,
        user.ipv4_pool_name,
        user.ipv6_dp_pool_name,
        user.ipv6_nt_pool_name,
      ]);
    } catch (e) {
      console.log(e);
    }
    logger.log('changelog', {
      message: `User: ${user.username} stored. `,
    });
  }

  static async deleteUser(conn, { username }) {
    let sql_delete =
      'DELETE radcheck, radusergroup ' +
      'FROM radcheck INNER JOIN radusergroup ' +
      'WHERE radcheck.username = radusergroup.username AND radcheck.username = ?;';

    logger.log('changelog', {
      message: `Deleting user: ${username}.`,
    });
    await conn.query(sql_delete, [username]);
    logger.log('changelog', {
      message: `User: ${username} has been deleted.`,
    });
  }
}

const get_profile_list = async function(conn) {
  const sql =
    'SELECT groupname, ' +
    '(SELECT count(username) ' +
    'FROM radusergroup as rug ' +
    'WHERE rug.groupname = rgr.groupname) as count ' +
    'FROM radius.radgroupreply as rgr ' +
    'GROUP BY groupname';

  return await conn.query(sql);
};

const get_ip4Pools = async function(conn) {
  const sql =
    'SELECT distinct pool_name ' +
    'FROM radippool ' +
    "WHERE pool_name LIKE '%_IPv4_%'";

  return await conn.query(sql);
};

const get_ip6PDPools = async function(conn) {
  const sql =
    'SELECT distinct pool_name ' +
    'FROM radippool ' +
    "WHERE pool_name LIKE '%_IPv6_Dele%'";

  return await conn.query(sql);
};

const get_ip6NTPools = async function(conn) {
  const sql =
    'SELECT distinct pool_name ' +
    'FROM radippool ' +
    "WHERE pool_name LIKE '%_IPv6_Non%'";

  return await conn.query(sql);
};

module.exports = Users;
