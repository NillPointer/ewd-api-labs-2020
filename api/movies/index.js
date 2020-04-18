import express from 'express';
import {
  getMovies, getMovie, getMovieReviews, getMovieCredits
} from '../tmdb-api';
import wrap from 'express-async-wrapper';

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
  getMovieReviews(id).then(reviews => res.status(200).send(reviews));
});

router.get('/:id/credits', (req, res) => {
  const id = parseInt(req.params.id);
  getMovieCredits(id).then(credits => res.status(200).send(credits));
});


export default router;