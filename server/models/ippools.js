const iputils = require('../lib/ip-utils');

class Ippools {

  static async showPools(conn, {
    page,
    size,
    sortBy,
    descending,
    searchString
  }) {

    sortBy = sortBy || 'pool_name';
    const order = descending ? 'DESC' : 'ASC';

    let optionalSearch = '';
    if (searchString) {
      optionalSearch =
        ` WHERE pool_name LIKE '%${searchString}%' OR framedipaddress LIKE '%${searchString}%' OR framedipmask LIKE '%${searchString}%' OR gateway_ip LIKE '%${searchString}%' OR nasipaddress LIKE '%${searchString}%' OR username LIKE '%${searchString}%' OR callingstationid LIKE '%${searchString}%' `;
    }

    let sql_IPs = `SELECT * FROM radippool ${optionalSearch}  ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?;`;
    let sql_count = `SELECT COUNT(id) as count FROM radippool ${optionalSearch};`;

    const [ip_pools] = await conn.query(sql_IPs, [size, (page - 1) * size]);
    const [count] = await conn.query(sql_count);

    return {
      pageData: ip_pools,
      total_count: count[0].count,
    };
  }

  static async saveIp(conn, {
    pool_name,
    framedipaddress,
    framedipmask,
    gateway_ip,
    username
  }) {
    let sql_save = 'INSERT INTO ' +
      'radippool(pool_name,framedipaddress,framedipmask,gateway_ip,username,pool_key) ' +
      'VALUES(?,?,?,?,?,?);';

    await conn.query(sql_save, [
      pool_name, framedipaddress, framedipmask, gateway_ip, username, 0
    ]);
  }

  static async savePool(conn, {
    cidr,
    pool_name,
    gateway
  }) {
    let sql_save = 'INSERT INTO ' +
      'radippool(pool_name,framedipaddress,framedipmask,gateway_ip) VALUES';

    if (!iputils.validIp(gateway)) {
      return {
        message: 'Invalid GW IP!'
      }
    }

    if (!iputils.validCIDR(cidr)) {
      return {
        message: 'Invalid subnet specified!'
      }
    }
    const mask = iputils.ipmask(cidr);

    // slice away bottom addresses
    // network + 2x phy + gw ip and the broadcast
    const iprange = iputils.iprange(cidr).slice(4, -1);

    // Do we have subnet big enough
    if (iprange.length < 123) {
      return {
        message: 'Subnet size must be bigger than /25!'
      }
    }
    // GW and subnet do not match
    if (!iputils.mask_contains(cidr, gateway)) {
      return {
        message: 'GW does not belong to subnet!'
      }
    }

    iprange.forEach(function (ip) {
      sql_save += '(\'' +
        pool_name + '\',\'' +
        ip + '\',\'' +
        mask + '\',\'' +
        gateway +
        '\'),';
    }, this);
    // remove trailing ","
    sql_save = sql_save.slice(0, -1);

    await conn.query(sql_save);
  }

  static async updateIp(conn, {
    pool_name,
    framedipaddress,
    framedipmask,
    gateway_ip,
    username,
    id
  }) {
    let sql_update = 'UPDATE radippool ' +
      'SET pool_name=?,framedipaddress=?,framedipmask=?,gateway_ip=?,' +
      'username=?,pool_key=0 ' +
      'WHERE id=?;';

    await conn.query(sql_update, [
      pool_name, framedipaddress, framedipmask, gateway_ip,
      username, id
    ]);
  }

  static async deleteIp(conn, {
    id
  }) {
    let sql_delete = 'DELETE FROM radippool WHERE id=?;';

    await conn.query(sql_delete, [id]);
  }
}

module.exports = Ippools;
