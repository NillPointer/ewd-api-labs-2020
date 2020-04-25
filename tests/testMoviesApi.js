import supertest from 'supertest';
import {
  app
} from '../index.js';
import should from 'should';
import userModel from '../api/users/userModel';
import movieModel from '../api/movies/movieModel';
import mongoose from 'mongoose';

const badToken = 'Bearer 123abc';
const testUser = {};
const testMovie = {};

describe('Movies API test', function () {
    this.timeout(120000);
  
    before((done) => {
      testUser.username = 'user1';
      testUser.password = 'test1';
      userModel.create(testUser)
      testMovie.id = 1;
      testMovie.title = "Test Movie";
      testMovie.reviews = [{author: 'tester', content: 'review'}]
      movieModel.create(testMovie).then(result => done()).catch(err => done(err))
    });
  
    it('should get a list of Movies', (done) => {
      let token = null;
      supertest(app)
        .post('/api/users')
        .send(testUser)
        .expect(200)
        .then((res) => {
          // HTTP status should be 200
          res.should.have.property('status').equal(200);
          res.body.should.have.property('success').equal(true);
          token = res.body.token;
          supertest(app)
            .get('/api/movies')
            .set('Authorization', token)
            .then((res) => {
              // HTTP status should be 200
              res.should.have.property('status').equal(200);
              done();
            }).catch(done)
        }).catch(err => done(err))
    });
  
    it('should prevent access to movies without valid token', (done) => {
      supertest(app)
        .get('/api/movies')
        .set('Authorization', badToken)
        .expect(401).then(res => {
          res.should.have.property('status').equal(401);
          done()
        }).catch(err => done(err))
    });

    it('should get a movie by id', (done) => {
      let token = null;
      supertest(app)
        .post('/api/users')
        .send(testUser)
        .expect(200)
        .then((res) => {
          // HTTP status should be 200
          res.should.have.property('status').equal(200);
          res.body.should.have.property('success').equal(true);
          token = res.body.token;
          supertest(app)
            .get('/api/movies/1')
            .set('Authorization', token)
            .then((res) => {
              // HTTP status should be 200
              res.should.have.property('status').equal(200);
              done();
            }).catch(done)
        }).catch(err => done(err))
    });

    it('should not get an invalid movie by id', (done) => {
      let token = null;
      supertest(app)
        .post('/api/users')
        .send(testUser)
        .expect(200)
        .then((res) => {
          // HTTP status should be 200
          res.should.have.property('status').equal(200);
          res.body.should.have.property('success').equal(true);
          token = res.body.token;
          supertest(app)
            .get('/api/movies/99999999999999')
            .set('Authorization', token)
            .then((res) => {
              // HTTP status should be 200
              res.should.have.property('status').equal(200);
              res.body.should.have.property('status_code').equal(34);
              res.body.should.have.property('status_message').equal('The resource you requested could not be found.');
              done();
            }).catch(done)
        }).catch(err => done(err))
    });

    it('should get movie reviews', (done) => {
      let token = null;
      supertest(app)
        .post('/api/users')
        .send(testUser)
        .expect(200)
        .then((res) => {
          // HTTP status should be 200
          res.should.have.property('status').equal(200);
          res.body.should.have.property('success').equal(true);
          token = res.body.token;
          supertest(app)
            .get('/api/movies/1/reviews')
            .set('Authorization', token)
            .then((res) => {
              // HTTP status should be 200
              res.should.have.property('status').equal(200);
              res.body.should.have.property('id').equal(1);
              res.body.should.have.property('results');
              res.body.results.should.have.lengthOf(1);
              done();
            }).catch(done)
        }).catch(err => done(err))
    });

    it('should not get movie reviews of an invalid movie', (done) => {
      let token = null;
      supertest(app)
        .post('/api/users')
        .send(testUser)
        .expect(200)
        .then((res) => {
          // HTTP status should be 200
          res.should.have.property('status').equal(200);
          res.body.should.have.property('success').equal(true);
          token = res.body.token;
          supertest(app)
            .get('/api/movies/99999999/reviews')
            .set('Authorization', token)
            .then((res) => {
              // HTTP status should be 200
              res.should.have.property('status').equal(500);
              res.body.should.be.empty();
              done();
            }).catch(done)
        }).catch(err => done(err))
    });

    it('should be able to add movie reviews', (done) => {
      let token = null;
      supertest(app)
        .post('/api/users')
        .send(testUser)
        .expect(200)
        .then((res) => {
          // HTTP status should be 200
          res.should.have.property('status').equal(200);
          res.body.should.have.property('success').equal(true);
          token = res.body.token;
          supertest(app)
            .post('/api/movies/1/reviews')
            .send({author:"tester", content: "new review"})
            .set('Authorization', token)
            .then((res) => {
              // HTTP status should be 200
              res.should.have.property('status').equal(200);
              res.body.should.not.be.empty();
              res.body.should.have.lengthOf(2);
              done();
            }).catch(done)
        }).catch(err => done(err))
    });

    it('should not be able to add movie reviews to an invalid movie', (done) => {
      let token = null;
      supertest(app)
        .post('/api/users')
        .send(testUser)
        .expect(200)
        .then((res) => {
          // HTTP status should be 200
          res.should.have.property('status').equal(200);
          res.body.should.have.property('success').equal(true);
          token = res.body.token;
          supertest(app)
            .post('/api/movies/999999999/reviews')
            .send({author:"tester", content: "new review"})
            .set('Authorization', token)
            .then((res) => {
              // HTTP status should be 200
              res.should.have.property('status').equal(500);
              res.body.should.be.empty();
              done();
            }).catch(done)
        }).catch(err => done(err))
    });
  });