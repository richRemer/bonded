var Promise = require("es6-promise").Promise;

/**
 * Wrap an asynchronous call so that it returns a Promise synchronously.  If an
 * object is provided, it will be bound to "this" in the async function.  If the
 * async function does pass errors to its callback, noerr should be set to true.
 * @param {function} async
 * @param {boolean} [noerr]
 * @param {object} [obj]
 * @returns {function}
 */
function bond(async, noerr, obj) {
    if (arguments.length < 3 && typeof noerr !== "boolean")
        obj = noerr, noerr = false;

    // resulting wrapper; accpets one less argument than original async call
    return function() {
        // wrapper arguments and calling context
        var args = Array.prototype.slice.call(arguments),
            context = this;

        // return a Promise which will be fulfilled by the async call
        return new Promise(function(resolve, reject) {
            // add missing callback argument to args
            if (noerr) args.push(resolve);
            else args.push(function(err, result) {
                // reject on error
                if (err) reject(err);

                // or resolve with result
                else resolve(result);
            });

            // make async call
            async.apply(obj || context, args);
        });
    };
}

/**
 * Wrap an asynchronous call so that it returns a Promise synchronously.  This
 * is the same as calling bond with noerr set to false, so it should only be
 * used for asynchronous calls which pass an error to their callback.
 * @param {function} async
 * @param {object} [obj]
 * @returns {function}
 */
function maybe(async, obj) {
    return bond(async, false, obj);
}

/**
 * Wrap an asynchronous call so that it returns a Promise synchronously.  This
 * is the same as calling bond with noerr set to true, so it should only be used
 * for asynchronous calls which do no pass an error to their callback.
 * @param {function} async
 * @param {object} [obj]
 * @returns {function}
 */
function eventually(async, obj) {
    return bond(async, true, obj);
}

/**
 * Wrap an asynchronous call so that the final callback argument becomes
 * optional.  If not provided, the wrapper will return a Promise synchronously.
 * This otherwise is the same as calling bond.
 * @param {function} async
 * @param {boolean} [noerr]
 * @param {object} [obj]
 * @returns {function}
 */
function bycall(async, noerr, obj) {
    if (arguments.length < 3 && typeof noerr !== "boolean")
        obj = noerr, noerr = false;

    var bondedCall = bond(async, noerr, obj);
  
    return function() {
        if (typeof arguments[arguments.length - 1] === "function")
            async.apply(obj || this, arguments);
        
        else return bondedCall.apply(this, arguments);
    };
}

/** export functions */
module.exports = {
    bond: bond,
    maybe: maybe,
    eventually: eventually,
    bycall: bycall,
    Promise: Promise
};
