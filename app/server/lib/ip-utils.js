const Netmask = require('netmask').Netmask;

const POW_256_3 = Math.pow(256, 3);
const POW_256_2 = Math.pow(256, 2);
const POW_256_1 = Math.pow(256, 1);
const POW_256_0 = Math.pow(256, 0);

const ip2long = function (ip_address) {
  if (!validIp(ip_address)) return false; // invalid IP address
  const parts = ip_address.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  return parts ? parts[1] * 16777216 + parts[2] * 65536 + parts[3] * 256 + parts[4] * 1 : false;
};

const long2ip = function (proper_address) {
  let output = false;
  if (!isNaN(proper_address) && (proper_address >= 0 || proper_address <= 4294967295)) {
    output = Math.floor(proper_address / POW_256_3) + '.' +
      Math.floor((proper_address % POW_256_3) / POW_256_2) + '.' +
      Math.floor(((proper_address % POW_256_3) % POW_256_2) / POW_256_1) + '.' +
      Math.floor((((proper_address % POW_256_3) % POW_256_2) % POW_256_1) / POW_256_0);
  }
  return output;
};

const cidrToRange = function (cidr) {
  var range = [2];
  cidr = cidr.split('/');
  if (cidr.length == 1) return false;
  if (!validIp(cidr[0])) return false; // invalid IP address
  if (cidr[1] < 0 || cidr[1] > 32 || isNaN(cidr[1])) return false; // invalid cidr address

  if (cidr[1] == 32) { // we are a single IP - do no calc
    return [cidr[0], cidr[0]];
  }

  var longStart = ip2long(cidr[0]);

  range[0] = long2ip((longStart) & ((-1 << (32 - cidr[1]))));
  range[1] = long2ip((longStart) + Math.pow(2, (32 - cidr[1])) - 1);
  return range;
};

const validIp = function (ip) {
  if (typeof ip !== 'string') return false; // only do strings
  var matches = ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
  return (matches ? true : false);
};

const validCIDR = function (cidr) {
  if (typeof cidr !== 'string') return false; // only do strings
  var matches = cidr.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}$/);
  return (matches ? true : false);
};

const iprange = function (cidr) {
  const range = [];
  if (validCIDR(cidr)) {
    if (cidr.indexOf('/') < 0) {
      //single IP
      return [cidr];
    }

    const block = new Netmask(cidr);

    var firstlong = ip2long(block.first);
    if (block.size > 2) {
      // Skip network
      firstlong -= 1;
    }

    const len = block.size;
    for (let i = 0; i < len; i++) {
      const ip = i + firstlong;
      range.push(long2ip(ip));
    }

    return range;
  }

  return range;
};

const ipmask = function (cidr) {
  if (validCIDR(cidr)) {
    return new Netmask(cidr).mask;
  }

  return false;
};

const mask_contains = function (cidr, ip) {
  if (validCIDR(cidr) && validIp(ip)) {
    return new Netmask(cidr).contains(ip);
  }
};

module.exports = {
  ip2long,
  long2ip,
  cidrToRange,
  validIp,
  validCIDR,
  iprange,
  ipmask,
  mask_contains
};
