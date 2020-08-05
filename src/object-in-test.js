import Obj2fsHooks from './obj2fs-hooks'

function ObjectInTest({prop1} = {prop1: ''}) {
  this.prop1 = prop1
  this.prop2 = 2
  this.prop3 = 'three'

  this.incProp2 = function() {
    this.prop2 += 1
  }

  return Object.assign(
    this,
    Obj2fsHooks(this),
  )
}

export default ObjectInTest
