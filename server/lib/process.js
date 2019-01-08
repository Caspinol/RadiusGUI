const exec = require('child_process').exec;

/*
  We will focus on Linux only at least for now
*/
module.exports = {
  isRunning: process_name => {
    const cmd = `ps aux | grep ${process_name}`;
    return new Promise((resolve, reject) => {
      exec(cmd, (err, stdout) => {
        if (err) reject(err);
        stdout.split('\n').forEach((l) => {
          const ll = l.toLowerCase();
          if (ll.indexOf('grep') === -1) { // skip the grep process itself
            if (ll.indexOf('radiusd') > -1) {
              resolve(true);
            }
          }
        })
        resolve(false);
      });
    });
  }
}
