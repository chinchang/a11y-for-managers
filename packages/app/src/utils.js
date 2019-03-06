export function random(a, b) {
  return a + ~~(Math.random() * (b - a));
}

export function getHandleFromName(fname, lname) {
  let handle = [
    `${fname.substr(0, random(0, fname.length - 1))}`,
    Math.random() > 0.5 ? "_" : "",
    `${lname.substr(0, random(0, lname.length - 1))}`
  ].join("");

  if (Math.random() > 0.7) {
    handle = `${handle}${random(0, 999)}`;
  }
  return handle;
}

export function getRandomDate() {
  return new Date(Date.now() - random(36000000, 94608000000));
}
