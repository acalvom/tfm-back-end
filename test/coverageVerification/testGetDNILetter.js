const dniLetter = require('../../app/coverageVerification/getDNILetter');
const expect = require('chai').expect;

describe('Testing letter for DNI: CHAI + regular function', function () {
    it('should return a letter H for the DNI', function () {
        let myLetter = dniLetter.getDNILetter(36061281);
        expect(myLetter).to.be.a('string');
        expect(myLetter).to.have.lengthOf(1);
        expect(myLetter).to.equal('H');
    });
    it('should return error as value for an empty DNI', function () {
        let myLetter = dniLetter.getDNILetter();
        expect(myLetter).to.be.a('string');
        expect(myLetter).to.equal('error');
    });
});
