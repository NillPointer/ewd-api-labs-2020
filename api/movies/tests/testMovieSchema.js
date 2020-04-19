
import should from 'should';
import sinon from 'sinon';
import sinonTestFactory from 'sinon-test';
import movieModel from '../movieModel';

const sinonTest = sinonTestFactory(sinon);

describe("moveiModelTests", () => {
    const goodMovie = {};
    const noIdMovie = {};
    const movieWithReviews = {};
    const movieReviewA = {};
    const movieReviewB = {};

    before(() => {
        // Valid movie
        goodMovie.id = 1;
        goodMovie.title = "Good Movie";
        // Invaid Movie
        noIdMovie.title = "Bad Movie";
        // Movie with Reviews
        movieReviewA.author = "Author A";
        movieReviewA.content = "Content A";
        movieReviewB.author = "Buthor B";
        movieReviewB.content = "Content B";
        movieWithReviews.id = 2;
        movieWithReviews.title = "Reviews Movie"
        movieWithReviews.reviews = [movieReviewA, movieReviewB];
    });

    it('should validate a movie id', done => {
        const m = new movieModel(goodMovie);
        m.validate(err => {
            should.not.exist(err);
            m.id.should.equal(goodMovie.id);
            m.title.should.equal(goodMovie.title);
            done();
        });
    });

    it('should require a movie id', done => {
        const m = new movieModel(noIdMovie);
        m.validate(err => {
            should.exist(err);
            const errors = err.errors;
            errors.should.have.property("id");
            done();
        });
    });

    it('should store movie reviews', done => {
        const m = new movieModel(movieWithReviews);
        m.validate(err => {
            should.not.exist(err);
            m.id.should.equal(movieWithReviews.id);
            m.title.should.equal(movieWithReviews.title);
            m.reviews.should.have.lengthOf(movieWithReviews.reviews.length);
            done();
        });
    });

    it('should get movies by id', sinonTest(function () {
        this.stub(movieModel, 'findOne');
        movieModel.findByMovieDBId(goodMovie.id);
        sinon.assert.calledWith(movieModel.findOne, {
            id: goodMovie.id
        });
    }));

    it('should get reviews of movies', sinonTest(function () {
        this.stub(movieModel, 'findMovieReviews').callsFake((id) => { return {
            id: movieWithReviews.id, 
            results: movieWithReviews.reviews 
        }});
        const m = movieModel.findMovieReviews(movieWithReviews.id);
        m.should.have.property('id');
        m.should.have.property('results');
        m.id.should.equal(movieWithReviews.id)
        m.results.should.have.lengthOf(movieWithReviews.reviews.length);
    }));
});