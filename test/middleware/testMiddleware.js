const chai = require('chai');
const expect = chai.expect;
const mocha = require('mocha');
const describe = mocha.describe;

const middleware = require('../../app/middleware/middleware');
const NO_TOKEN_GENERATED = require('../../app/resources/constants').NO_TOKEN_GENERATED;

describe('Testing Middleware', function () {
    it('should return a new token', function () {
        let token = middleware.generateToken('aaa@aaa.com', 'teacher');
        expect(token).to.be.a('string');
        expect(token).to.not.be.null;
    });
    it('should return error as value for an empty token', function () {
        let token = middleware.generateToken();
        expect(token).to.be.a('string');
        expect(token).to.equal(NO_TOKEN_GENERATED);
    });
});
