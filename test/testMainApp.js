const expect = require('chai').expect;
const request = require('request');
require('../index');

it('Main page content', function (done) {
    request('http://localhost:8000', function (error, response, body) {
        expect(body).to.equal('Welcome to our gym!');
        done();
    });
});

it('Main page status', function (done) {
    request('http://localhost:8000', function (error, response) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});

it('About page content', function (done) {
    request('http://localhost:8000/about', function (error, response) {
        expect(response.statusCode).to.equal(404);
        done();
    });
});
