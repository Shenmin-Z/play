export let buildUrl = (host: string, params: { [s: string]: any }) => {
  let keys = Object.keys(params);
  let p = [];
  for (let k of keys) {
    p.push(`${k}=${params[k]}`);
  }
  if (p.length === 0) return host;
  return host + "?" + p.join("&");
};
