var Promise = require("es6-promise").Promise;

/**
 * Wrap an asynchronous call to return a Promise synchronously.  If an object
 * is provided, it will be bound to "this" in the async function.
 * @param {function} async
 * @param {object} [obj]
 * @returns {function}
 */
function maybe(async, obj) {
    // resulting wrapper; accepts one less argument than original async call
    return function() {
        // wrapper arguments
        var args = Array.prototype.slice.call(arguments);

        // return a Promise which will be fulfilled by the async call
        return new Promise(function(resolve, reject) {
            // add missing callback argument to args
            args.push(function(err, result) {
                // reject on error
                if (err) reject(err);

                // or resolve with result
                else resolve(result);
            });

            // make async call
            async.apply(obj, args);
        });
    };
}

/** export functions */
module.exports = {
    maybe: maybe,
    Promise: Promise
};
