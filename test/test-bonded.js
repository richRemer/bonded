var bonded = require(".."),
    expect = require("expect.js"),
    Promise = bonded.Promise;

// async call which does not generate errors
function async(arg, done) {
    setTimeout(function() {done(arg);}, 0);
}

// async call which will be successful
function asyncFulfill(arg, done) {
    setTimeout(function() {done(null, arg);}, 0);
}

// async call which will fail
function asyncReject(arg, done) {
    setTimeout(function() {done(new Error("error"));}, 0);
}

describe("bonded.maybe", function() {
    it("should wrap an async call to return Promise", function(done) {
        var fulfill, reject;

        fulfill = bonded.maybe(asyncFulfill)(42);
        fulfill.then(function(arg) {
            expect(arg).to.be(42);

            reject = bonded.maybe(asyncReject)(42);
            reject.catch(function(err) {
                expect(err).to.be.an(Error);
                done();
            });
        });
    });
});

