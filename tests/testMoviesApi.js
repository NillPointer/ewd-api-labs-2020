import supertest from 'supertest';
import {
  app
} from '../index.js';
import should from 'should';
import userModel from '../api/users/userModel';
import mongoose from 'mongoose';

const badToken = 'Bearer 123abc';
const testUser = {};

describe('Movies API test', function () {
    this.timeout(120000);
  
  
    before((done) => {
      testUser.username = 'user1';
      testUser.password = 'test1';
      userModel.create(testUser).then(result => done()).catch(err => done(err))
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
            })
        }).catch(err => done(err))
    });
  
    it('should prevent access to movies without valid token', async () => {
      supertest(app)
        .get('/api/movies')
        .set('Authorization', badToken)
        .expect(401).then(res => {
          res.should.have.property('status').equal(401);
          done()
        }).catch(err => done(err))
    });
  });