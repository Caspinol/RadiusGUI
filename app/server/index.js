require('dotenv').config({ path: '../../RadiusGUI.env' });
const Koa = require('koa');
const consola = require('consola');

const app = new Koa();
app.use(
  require('koa2-cors')({
    origin: '*',
    allowMethods: ['GET', 'POST', 'DELETE'],
  })
);

const path2method = (path) => {
  path = path.split('-');
  if (path.length === 1) {
    return path[0];
  } else if (path.length > 1) {
    const parts = path.slice(1).map((part) => {
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
import models from './models';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

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
      console.error(err);
    }
    await next();
  }
});

app.use(async (ctx, next) => {
  if (ctx.path.startsWith('/api') === false || ctx.request.method !== 'POST') {
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
        `Error handling the request in ${apiMethod} handler. Error: `,
        e
      );
    } finally {
      if (conn) conn.release();
    }
  }
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

const http = require('http');
http.createServer(app.callback()).listen(port, host, () => {
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
});
