export function formatDate(t) {
  if (t) {
    return t.replace(/T/, ' ').replace(/\..+/, ' ');
  }
  return t;
}

export function sec2HHMMSS(s) {
  return new Date(s * 1000).toISOString().substr(11, 8);
}

export function randomString(len) {
  var text = '';
  var allowed =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i <= len; i++)
    text += allowed.charAt(Math.floor(Math.random() * allowed.length));

  return text;
}
