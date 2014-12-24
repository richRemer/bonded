bonded
======
The `bonded` module provides functions for wrapping Node.js style calls
`function(arg_1, ..., function(err, result))` in `Promise` objects.

Example - Wrap a standard Node.js asynchronous call within a Promise
--------------------------------------------------------------------
```js
var bonded = require("bonded"),
    fs = require("fs"),
    fdMaybe, fd;

// create a Promise variant of fs.open
fs.openMaybe = bonded.maybe(fs.open);

// use the function to get a Promised file descriptor
fdMaybe = fs.openMaybe("/tmp/file", "r");

// set the fd once the Promise is fulfilled or display error
fdMaybe
    .then(function(val) {fd = val;})
    .catch(console.error.bind(console));
```

Example - Wrap within a Promise an asynchronous call which does not pass an error
---------------------------------------------------------------------------------
```js
var bonded = require("bonded"),
    fs = require("fs"),
    existsEventually;

// created a Promise variant of fs.exists
fs.existsEventually = bonded.eventually(fs.exists);

// use the function to get a Promised result
existsEventually = fs.existsEventually("/tmp/file");

// display a message once the Promise is fullfilled
existsEventually.then(function(exists) {
    if (exists) console.log("file exists");
    else console.log("file does not exist");
});
```

Example - Binding `this` context
--------------------------------
```js
var bonded = require("bonded"),
    nano = require("nano")("http://example.com:5984"),  // nano CouchDB client
    db = nano.db.use("db");

// won't work; nano.db.insert requires 'this' to be bound to 'db'
var insertMaybe = bonded.maybe(db.insert);

// you could do this, of course
var insertMaybe = bonded.maybe(db.insert.bind(db));

// you can also do this with the maybe function
var insertMaybe = bonded.maybe(db.insert, db);

// use the function to insert a document
var insertedMaybe = insertMaybe({foo: 42}, "example_id");

// handle success/failure
insertedMaybe.then(function(inserted) {
    console.log("inserted document", inserted.id, "revision", inserted.rev);
}).catch(function(err) {
    console.error(err);
});
```

Other Notes
-----------
 * what if the callback passes multiple results? (the nano example glosses over
   this detail; `insert` passes body and headers to callback)
