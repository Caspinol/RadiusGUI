require('dotenv').config({
  path: 'RadiusGUI.env',
});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const Koa = require('koa');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');

const app = new Koa();
app.use(
  require('koa2-cors')({
    origin: '*',
    allowMethods: ['GET', 'POST', 'DELETE'],
  })
);

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js');
config.dev = !(app.env === 'production');

const path2method = path => {
  path = path.split('-');
  if (path.length === 1) {
    return path[0];
  } else if (path.length > 1) {
    const parts = path.slice(1).map(part => {
      return `${part[0].toUpperCase()}${part.slice(1)}`;
    });
    return `${path[0]}${parts.join('')}`;
  } else {
    return path;
  }
};

const mysql = require('mysql2/promise');
const multipart = require('co-busboy');
const parse = require('co-body');
const models = require('./models');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

const spdy = require('spdy');
const path = require('path');
const fs = require('fs');

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config);

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  app.use(require('koa-helmet')());

  app.use(async (ctx, next) => {
    if (['GET', 'DELETE'].includes(ctx.request.method)) {
      await next();
    } else if (ctx.is('application/json')) {
      ctx.json = await parse.json(ctx);
      await next();
    } else if (ctx.is('multipart/*') === 'multipart/form-data') {
      ctx.parts = multipart(ctx, {
        autoFields: true,
      });

      await next();
    } else {
      try {
        ctx.json = await parse.json(ctx);
      } catch (err) {
        ctx.json = null;
      }
      await next();
    }
  });

  app.use(async (ctx, next) => {
    if (
      ctx.path.startsWith('/api') === false ||
      ctx.request.method !== 'POST'
    ) {
      await next();
    } else {
      const apiMethod = ctx.path.split('/api/')[1];
      let [model, method] = apiMethod.split('/');
      model = path2method(model).replace(
        /^(.)(.*)/,
        (_, f, r) => `${f.toUpperCase()}${r}`
      );
      method = path2method(method);

      let conn = null;
      try {
        conn = await pool.getConnection();
        ctx.body = await models[model][method](conn, ctx.json);
      } catch (e) {
        console.error(
          `Error handling the request in ${
            models[model][method]
          } handler. Error: `,
          e
        );
      } finally {
        conn.release();
      }
    }
  });

  app.use(ctx => {
    ctx.status = 200; // koa defaults to 404 when it sees that status is unset
    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve);
      ctx.res.on('finish', resolve);
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject);
      });
    });
  });

  const keys = {};
  try {
    keys.serviceKey = fs.readFileSync(path.join(process.env.SSL_KEY));
    keys.certificate = fs.readFileSync(path.join(process.env.SSL_CERT));
  } catch (err) {
    console.log('Failed to read certificate files: ', err);
    process.exit();
  }

  const credentials = {
    key: keys.serviceKey,
    cert: keys.certificate,
  };

  const server = spdy.createServer(credentials, app.callback());
  const port = process.env.SSL_PORT || 8443;
  const host = process.env.HOST || 'localhost';

  server.listen(port, host, () => {
    consola.ready({
      message: `Server listening on https://${host}:${port}`,
      badge: true,
    });
  });
}

start();
