import manifest from '../../.manifest.json'

const parse = (obj) => {
  let count = 0;
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      count += parse(obj[key])
    } else {
      count++
    }
  }
  obj.__count = count;
  return count;
}

parse(manifest.routes)
parse(manifest.middleware)

export default manifest
