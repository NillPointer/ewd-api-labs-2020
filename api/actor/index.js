import express from 'express';
import {
  getActor, getActorMovies
} from '../tmdb-api';

const router = express.Router();

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    getActor(id).then(actor => res.status(200).send(actor));
});

router.get('/:id/movies', (req, res) => {
    const id = parseInt(req.params.id);
    getActorMovies(id).then(actorMovies => res.status(200).send(actorMovies));
});

export default router;