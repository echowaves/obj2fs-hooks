const path = require('path')
const fs = require('fs-extra')

const Obj2fsHooks = state => ({
  /* returns JSON String representation of the object */
  stringify() {
    return JSON.stringify(state)
  },

  /* assigns state of the current instance from the JSON string */
  parse(json) {
    const obj = JSON.parse(json)
    return Object.assign(state, obj)
  },

  /* store object in fs, key === file_name */
  store(key) {
    const json = this.stringify()
    fs.ensureFileSync(path.resolve(key))
    fs.writeFileSync(path.resolve(key), json)
    return json
  },

  /* retrieve object from fs, key === file_name */
  retrieve(key) {
    if (!fs.existsSync(path.resolve(key))) {
      throw new Error('No such key or file name found on disk')
    }
    return this.parse(fs.readFileSync(path.resolve(key)))
  },

  /*  retrieve object from fs, key === file_name, or return new Object initialized with default constructor() */
  retrieveOrNew(key) {
    if (!fs.existsSync(path.resolve(key))) {
      fs.writeFileSync(path.resolve(key), this.stringify())
    }
    return this.parse(fs.readFileSync(path.resolve(key)))
  },
})

export default Obj2fsHooks
