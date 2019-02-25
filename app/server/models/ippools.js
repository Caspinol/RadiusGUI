const iputils = require('../lib/ip-utils');
const logger = require('../lib/logging');

class Ippools {
  static async showPools(
    conn,
    { page, rowsPerPage, sortBy, descending, searchString }
  ) {
    sortBy = sortBy || 'pool_name';
    const order = descending ? 'DESC' : 'ASC';

    let optionalSearch = '';
    if (searchString) {
      optionalSearch = ` WHERE pool_name LIKE '%${searchString}%' OR framedipaddress LIKE '%${searchString}%' OR framedipmask LIKE '%${searchString}%' OR gateway_ip LIKE '%${searchString}%' OR nasipaddress LIKE '%${searchString}%' OR username LIKE '%${searchString}%' OR callingstationid LIKE '%${searchString}%' `;
    }

    let sql_pagesize = '';
    if (Number(rowsPerPage) > 0) {
      sql_pagesize = `LIMIT ${rowsPerPage} OFFSET ${(page - 1) * rowsPerPage}`;
    }

    let sql_IPs = `SELECT * FROM radippool ${optionalSearch}  ORDER BY ${sortBy} ${order} ${sql_pagesize};`;
    let sql_count = `SELECT COUNT(id) as count FROM radippool ${optionalSearch};`;

    const [ip_pools] = await conn.query(sql_IPs);
    const [count] = await conn.query(sql_count);

    return {
      pageData: ip_pools,
      total_count: count[0].count,
    };
  }

  static async saveIp(
    conn,
    { pool_name, framedipaddress, framedipmask, gateway_ip, username }
  ) {
    let sql_save =
      'INSERT INTO ' +
      'radippool(pool_name,framedipaddress,framedipmask,gateway_ip,username,pool_key) ' +
      'VALUES(?,?,?,?,?,?);';

    logger.log('changelog', {
      message: `Adding new IP entry: [${pool_name}, ${framedipaddress}, ${framedipmask}, ${gateway_ip}, ${username}]`,
    });
    await conn.query(sql_save, [
      pool_name,
      framedipaddress,
      framedipmask,
      gateway_ip,
      username,
      0,
    ]);

    logger.log('changelog', {
      message: `IP entry stored.`,
    });
  }

  static async savePool(conn, { cidr, pool_name, gateway }) {
    let sql_save =
      'INSERT INTO ' +
      'radippool(pool_name,framedipaddress,framedipmask,gateway_ip) VALUES';

    logger.log('changelog', {
      message: `Adding new IP pool entry.`,
    });
    if (!iputils.validIp(gateway)) {
      logger.log('changelog', {
        message: `The GW IP: ${gateway} is invalid for ${cidr} subnet.`,
      });
      return {
        message: 'Invalid GW IP!',
      };
    }

    if (!iputils.validCIDR(cidr)) {
      logger.log('changelog', {
        message: `The ${cidr} subnet is invalid.`,
      });
      return {
        message: 'Invalid subnet specified!',
      };
    }
    const mask = iputils.ipmask(cidr);

    // slice away bottom addresses
    // network + 2x phy + gw ip and the broadcast
    const iprange = iputils.iprange(cidr).slice(4, -1);

    // Do we have subnet big enough
    if (iprange.length < 123) {
      logger.log('changelog', {
        message: `The subnet size must be larger than /25.`,
      });
      return {
        message: 'Subnet size must be bigger than /25!',
      };
    }
    // GW and subnet do not match
    if (!iputils.mask_contains(cidr, gateway)) {
      logger.log('changelog', {
        message: `The ${gateway} does not belong within ${cidr} subnet.`,
      });
      return {
        message: 'GW does not belong to subnet!',
      };
    }

    iprange.forEach(function(ip) {
      sql_save +=
        "('" + pool_name + "','" + ip + "','" + mask + "','" + gateway + "'),";
    }, this);
    // remove trailing ","
    sql_save = sql_save.slice(0, -1);
    logger.log('changelog', {
      message: `Saving pool: [${cidr}, ${gateway}]`,
    });
    await conn.query(sql_save);
    logger.log('changelog', {
      message: `Saved.`,
    });
    return {
      message: 'ok',
    };
  }

  static async updateIp(
    conn,
    { pool_name, framedipaddress, framedipmask, gateway_ip, username, id }
  ) {
    let sql_update =
      'UPDATE radippool ' +
      'SET pool_name=?,framedipaddress=?,framedipmask=?,gateway_ip=?,' +
      'username=?,pool_key=0 ' +
      'WHERE id=?;';

    logger.log('changelog', {
      message: `Updating IP entry: [${pool_name}, ${framedipaddress}, ${framedipmask}, ${gateway_ip}, ${username}]`,
    });
    await conn.query(sql_update, [
      pool_name,
      framedipaddress,
      framedipmask,
      gateway_ip,
      username,
      id,
    ]);
    logger.log('changelog', {
      message: `Updated.`,
    });
  }

  static async deleteIp(conn, { id }) {
    let sql_delete = 'DELETE FROM radippool WHERE id=?;';
    logger.log('changelog', {
      message: `Deleting IP entry [${id}]`,
    });

    await conn.query(sql_delete, [id]);

    logger.log('changelog', {
      message: `Deleted.`,
    });
  }
}

module.exports = Ippools;
