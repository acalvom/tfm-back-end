const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

const url = 'http://localhost:8000';
const toTest = require('../../index');

describe('get all database', function () {
    it('should get all database', function (done) {
        chai.request(url)
        chai.request(toTest)
            .get('/connectdb')
            .end(function (err,res) {
                expect(res).to.have.status(200);
                expect(res.body[0]).to.have.property('id',1);
                expect(res.body[2]).to.have.property('isConnected',0);
                expect(res.body).to.be.a('array');
                done();
            });
    });
})
