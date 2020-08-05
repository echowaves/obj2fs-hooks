import Json2ObjHOC from 'json2obj-hoc'

const path = require('path')
const fs = require('fs-extra')

const Obj2fsHOC = WrappedObject => class extends Json2ObjHOC(WrappedObject) {

  /* store object in fs, key === file_name */
  store(key) {
    const json = this.stringify()
    fs.ensureFileSync(path.resolve(key))
    fs.writeFileSync(path.resolve(key), json)
    return json
  }

  /* retrieve object from fs, key === file_name */
  retrieve(key) {
    if (!fs.existsSync(path.resolve(key))) {
      throw new Error('No such key or file name found on disk')
    }
    return this.parse(fs.readFileSync(path.resolve(key)))
  }

  /*  retrieve object from fs, key === file_name, or return new Object initialized with default constructor() */
  retrieveOrNew(key) {
    let obj
    if (!fs.existsSync(path.resolve(key))) {

      fs.writeFileSync(path.resolve(key), this.stringify())
    }
    obj = this.parse(fs.readFileSync(path.resolve(key)))

    return obj
  }
}

export default Obj2fsHOC
