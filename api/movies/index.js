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
  Movie.findMovieReviews(id)
  .then(results => results ? res.status(200).send(results) : res.status(500).send(null))
});

router.post('/:id/reviews', (req, res) => {
  const id = parseInt(req.params.id);
  Movie.findByMovieDBId(id).then(movie => {
    if (!movie){
      res.status(500).send(null);
    } else {
      movie.reviews.push(req.body)
      movie.save().then(res.status(200).send(movie.reviews))
    }
  });
});

router.get('/:id/credits', (req, res) => {
  const id = parseInt(req.params.id);
  getMovieCredits(id).then(credits => credits ? res.status(200).send(credits) : res.status(500).send(null));
});


export default router;