import supertest from 'supertest';
import {
    app
} from '../index.js';
import should from 'should';
import userModel from '../api/users/userModel';
import movieModel from '../api/movies/movieModel';

const testUser = {};
const invalidUser = {};

// Tests begin
describe('Users API test', function () {
    this.timeout(120000);

    before(done => {
        testUser.username = 'user2';
        testUser.password = 'test2';
        invalidUser.username = 'chancer1';
        invalidUser.password = 'bad1';
        userModel.create(testUser).then(res => done()).catch(err => done(err));
    });

    it('should get all users', (done) => {
        supertest(app)
        .get('/api/users')
        .expect('Content-type', /json/)
        .expect(200)
        .then(res => {
            res.should.have.property('status').equal(200);
            res.body.should.be.Array;
            res.body.should.have.lengthOf(2);
            res.body[0].username.should.equal('user1');
            res.body[1].username.should.equal('user2');
            done();
        }).catch(err => done(err));
    });

    it('should update a user', done => {
        testUser.favourites = ["5e9c45fae29fa52c55ddae8c"]
        supertest(app)
        .put(`/api/users/${testUser.username}`)
        .send(testUser)
        .expect('Content-type', /json/)
        .expect(200)
        .then(res => {
            res.should.have.property('status').equal(200);
            res.body.should.have.property('favourites');
            res.body.favourites.should.have.lengthOf(1);
            done();
        }).catch(done);
    });

    it('should register a user', (done) => {

        const newUser = {
            username: "new_user_test",
            password: "apassword"
        };

        supertest(app)
            .post('/api/users')
            .send(newUser)
            .query({
                action: 'register'
            })
            .expect('Content-type', /json/)
            .expect(201) // This is the HTTP response
            .then(res => {
                // HTTP status should be 200
                res.should.have.property('status').equal(201);
                done();
            }).catch(err => done(err));
    });

    it('should return a user token for a valid user', done => {
        supertest(app)
        .post('/api/users')
        .send(testUser)
        .expect('Content-type', /json/)
        .expect(200)
        .then(res => {
            res.should.have.property('status').equal(200);
            res.body.success.should.be.true;
            res.body.token.should.exist;
            done();
        }).catch(err => done(err));
    });

    it('should not return a token for an invalid user', done => {
        supertest(app)
        .post('/api/users')
        .send(invalidUser)
        .expect('Content-type', /json/)
        .expect(401)
        .then(res => {
            res.should.have.property('status').equal(401);
            should.not.exist(res.body.token);
            done();
        }).catch(err => done(err));
    });
});