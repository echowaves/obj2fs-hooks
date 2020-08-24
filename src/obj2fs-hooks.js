const path = require('path')
const fs = require('fs-extra')

const Obj2fsHooks = state => ({
  // must call this function to attach object to store by key
  setKey(KEY) {
    this.KEY = KEY
    return this
  },
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
  store() {
    const json = this.stringify()
    fs.outputFileSync(path.resolve(this.KEY), json)
    return json
  },

  /* retrieve object from fs, key === file_name */
  retrieve() {
    if (!fs.existsSync(path.resolve(this.KEY))) {
      throw new Error('No such key or file name found on disk')
    }
    return this.parse(fs.readFileSync(path.resolve(this.KEY)))
  },

  /*  retrieve object from fs, key === file_name, or return new Object initialized with default constructor() */
  retrieveOrNew() {
    if (!fs.existsSync(path.resolve(this.KEY))) {
      fs.outputFileSync(path.resolve(this.KEY), this.stringify())
    }
    return this.parse(fs.readFileSync(path.resolve(this.KEY)))
  },
})

export default Obj2fsHooks
