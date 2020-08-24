# obj2fs-hooks
A set of hooks that can be injected into your functional components to enhance their behavior. Specifically, to make these components persistable to file system as JSON strings.

## Usage

In the class that you want to enhance with this HOC
```js
import Obj2fsHooks from 'obj2fs-hooks'

```
Then declare your like this:
```js
function Account({ publicKey } = { publicKey: '' }) {// have to make publicKey optional
    this.publicKey = publicKey
    this.balance = 0
    this.stake = 0

  // this method defines behavior of Account data type,
  // which will be preserved after you deserialize the object from JSON
  this.addBalance({ amount }) {
    this.balance += amount
  }

  return Object.assign(
    this,
    Obj2fsHooks(this),
  )
}

export default Account // exporting enhanced Account
```
Enhancing ```Account``` with ```Obj2fsHooks``` adds 6 methods to ```Account``` type.

```setKey(KEY)``` which associates an Object with a KEY (path on disk), returns this so can be chained


```stringify()``` which is self explanatory -- returns JSON string representation of the object.


```parse(json)``` which returns object instance of correct type.


```store()``` which saves `this` object as JSON string to disk with name `KEY`. It will create the file if it does not exist.


```retrieve()``` which loads object instance of correct type from disk. If the file is not found it will throw exception. ```throw new Error('No such key or file name found on disk')```


```retrieveOrNew()``` which loads object instance of correct type from disk. If the file is not found it will create a new file contents of an object initialized with default constructor and then return it. This method should never fail.


Here are examples how to use the ```Account``` object:

```js
import Account from './account'

let account = new Account({ publicKey: 'some public key' }) // constructor with required parameter
const amount = 100
account.addBalance({ amount })

let jsonAccount = account.stringify()
// jsonAccount will have the right amount

// now let's re-created another instance of the Account object from JSON string
let generatedAccount = new Account().parse(jsonAccount)
// can still call the addBalance method, because the object is of the right type
generatedAccount.addBalance({ amount })

console.log(generatedAccount.balance) // ----> 200

// here is how to store/retrieve account by key
jsonAccount = account.setKey(key).store()
// jsonAccount will be saved to disk as JSON string

// now let's re-created another instance of the Account object from file on disk
generatedAccount = new Account().setKey(key).retrieve()
// can still call the addBalance method, because the object is of the right type
generatedAccount.addBalance({ amount })

console.log(generatedAccount.balance) // ----> 300
```

## Future
Currently only synch version is supported. There are plans to include asynch methods at some point.
