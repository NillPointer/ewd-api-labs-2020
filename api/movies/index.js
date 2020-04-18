import express from 'express';
import {
  getMovies, getMovie, getMovieReviews, getMovieCredits
} from '../tmdb-api';
import wrap from 'express-async-wrapper';
import Movie from './movieModel';

const router = express.Router();

router.get('/', (req, res) => {
  getMovies().then(movies => res.status(200).send(movies));
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  getMovie(id).then(movie => res.status(200).send(movie));
});

router.get('/:id/reviews', (req, res) => {
  const id = parseInt(req.params.id);
  Movie.findByMovieDBId(id).then(movie => res.status(200).send(movie.reviews));
});

router.post('/:id/reviews', (req, res) => {
  const id = parseInt(req.params.id);
  Movie.findByMovieDBId(id).then(movie => {
    movie.reviews.push(req.body);
    movie.save().then(res.status(200).send(movie.reviews));
  })
})

router.get('/:id/credits', (req, res) => {
  const id = parseInt(req.params.id);
  getMovieCredits(id).then(credits => res.status(200).send(credits));
});


export default router;