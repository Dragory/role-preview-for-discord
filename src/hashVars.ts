export function getHashVars() {
  return window.location.hash
    .slice(2) // Remove #? at the beginning
    .split("&")
    .filter(Boolean)
    .reduce((obj, hashVar) => {
      const [prop, value] = hashVar.split("=");
      obj[prop] = value;
      return obj;
    }, {} as any);
}

function stringifyHashVars(obj: any) {
  const varStr = Object.entries(obj)
    .map(([prop, value]) => `${prop}=${value}`)
    .join("&");

  return varStr ? `#?${varStr}` : "";
}

export function setHashVars(obj: any) {
  const hashVars = stringifyHashVars(obj);
  window.history.replaceState(null, "", stringifyHashVars(hashVars));
}
