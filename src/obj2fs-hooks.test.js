import ObjectInTest from './object-in-test'
const path = require('path')
const fs = require('fs-extra')

describe('ObjectInTest', () => {
  const KEY = './.test/obj.json'
  let objectInTest
  beforeEach(() => {
    objectInTest = new ObjectInTest().setKey(KEY)
  })

  describe('objectInTest.store()', () => {
    beforeEach(() => {
      fs.removeSync(path.resolve(KEY))
    })

    it('should generate file with `KEY`', () => {
      expect(fs.existsSync(KEY)).toBe(false)
      objectInTest.store()
      expect(fs.existsSync(KEY)).toBe(true)
    })
    it('should return json string', () => {
      expect(fs.existsSync(KEY)).toBe(false)
      const jsonObjectInTest = objectInTest.store()
      expect(typeof jsonObjectInTest).toBe('string')
      expect('{"prop1":"","prop2":2,"prop3":"three","KEY":"./.test/obj.json"}')
        .toEqual(jsonObjectInTest) })
  })

  describe('ObjectInTest.retrieve(key)', () => {
    beforeEach(() => {
      objectInTest.incProp2()
      objectInTest.store()
    })

    it('should retrieve file named `key`', () => {
      const retrievedObject = new ObjectInTest().setKey(KEY).retrieve()
      expect(retrievedObject.constructor.name).toBe("ObjectInTest")
      expect(retrievedObject.prop1).toBe('')
      expect(retrievedObject.prop2).toBe(3) // this value is different from default and should be retrieved from file
      expect(retrievedObject.prop3).toBe('three')
      retrievedObject.incProp2() // test if object contains methods that correspond to type object type
      expect(retrievedObject.prop2).toBe(4)
    })
    it('should fail to retrieve file  that does not exist', () => {
      fs.removeSync(`${KEY}-non_existing_key`)
      expect(() => {
        new ObjectInTest().setKey(`${KEY}-non_existing_key`).retrieve()
      }).toThrowError('No such key or file name found on disk')
    })
  })

  describe('ObjectInTest.retrieveOrNew(key)', () => {
    beforeEach(() => {
      objectInTest.store()
    })
    it('should retrieve file named `key`', () => {
      const retrievedObject = new ObjectInTest().setKey(KEY).retrieveOrNew()
      expect(retrievedObject.constructor.name).toBe("ObjectInTest")
      expect(retrievedObject.prop1).toBe('')
      expect(retrievedObject.prop2).toBe(2)
      expect(retrievedObject.prop3).toBe('three')
      retrievedObject.incProp2() // test if object contains methods that correspond to type object type
      expect(retrievedObject.prop2).toBe(3)
    })
    it('should create new instance when file does not exist', () => {
      fs.removeSync(`${KEY}-non_existing_key`)
      const newObjects = new ObjectInTest().setKey(`${KEY}-non_existing_key`).retrieveOrNew()
      expect(newObjects.prop1).toBe('')
      expect(newObjects.prop2).toBe(2)
      expect(newObjects.prop3).toBe('three')
      newObjects.incProp2() // test if object contains methods that correspond to type object type
      expect(newObjects.prop2).toBe(3)
    })
  })

  describe('objectInTest.stringify()', () => {
    it('should generate valid JSON string representing the `ObjectInTest` instance', () => {
      const jsonObjectInTest = objectInTest.stringify()
      expect(typeof jsonObjectInTest).toBe('string')
      expect('{"prop1":"","prop2":2,"prop3":"three","KEY":"./.test/obj.json"}')
        .toEqual(jsonObjectInTest)
    })
  })

  describe('ObjectInTest.parse()', () => {
    it('should generate an `ObjectInTest` instance from JSON', () => {
      const jsonObjectInTest = objectInTest.stringify()

      const generatedObjectInTest = new ObjectInTest().parse(jsonObjectInTest)

      expect(generatedObjectInTest.stringify()).toBe(objectInTest.stringify())

      // check if the loaded object responds to methods calls after re-construction from JSON
      generatedObjectInTest.incProp2()
      expect(generatedObjectInTest.prop2).toEqual(3)
    })
    it('should fail to generate an `ObjectInTest` object from wrong JSON', () => {
      expect(() => {
        new ObjectInTest().parse('{ some: json }')
      }).toThrowError('Unexpected token s in JSON at position 2')
    })
  })
})
