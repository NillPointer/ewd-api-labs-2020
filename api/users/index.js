import express from 'express';
import User from './userModel';
import Movie from '../movies/movieModel';
import jwt from 'jsonwebtoken';

const router = express.Router(); // eslint-disable-line

// Get all users
router.get('/', (req, res) => {
    User.find().then(users =>  res.status(200).json(users));
});

// Register/login a user
router.post('/', (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        res.json({
            success: false,
            msg: 'Please pass username and password',
        });
    }
    if (req.query.action === 'register') {
        User.create({
            username: req.body.username,
            password: req.body.password,
        }).then(user => res.status(201).json({
            code: 201,
            msg: 'Successfully created new user',
        })).catch(next);
    } else {
        User.findByUserName(req.body.username).then(user => {
            if (!user) return res.status(401).send({code: 401, msg: 'Authentication failed. User not found.'});
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (isMatch && !err) {
                    // If user is found and password matches create a token
                    const token = jwt.sign(user.username, process.env.secret);
                    // Return the information including token as JSON
                    res.status(200).json({
                        success: true,
                        token: 'BEARER '+token,
                    });
                } else {
                    res.status(401).send({
                        code: 401,
                        msg: 'Authentication failed. Wrong password'
                    });
                }
            })
        }).catch(next);
    }
});

// Update a user (only password and favourites)
router.put('/:userName',  (req, res, next) => {
    const userName = req.params.userName;
    if (req.body._id) delete req.body._id;
    User.findByUserName(userName).then(user => {
        user.password = req.body.password;
        user.favourites = req.body.favourites;
        return user.save().then(user => res.status(200).send(user)).catch(next);
    }).catch(next);
});

// Get user favourites
router.get('/:userName/favourites', (req, res) => {
    const userName = req.params.userName;
    User.findByUserName(userName).populate('favourites').then(
        user => res.status(200).send(user.favourites)
    )
});

// Add user favourites
router.post('/:userName/favourites', (req, res, next) => {
    const newFavourite = req.body;
    const userName = req.params.userName;
    if (newFavourite && newFavourite.id) {
        Movie.findOneAndUpdate({id: newFavourite.id},newFavourite,{new:true,upsert:false}).then(movie => {
            if (!movie) return res.status(500).send({error: "No such movie found"});
            User.findByUserName(userName).then(
                    (user) => { 
                       (user.favourites.indexOf(movie._id)>-1)?user:user.favourites.push(movie._id.toString());
                       user.save().then(user => res.status(201).send(user))
                      }
            );
        }).catch(next);
    } else {
        res.status(401).send("unable")
    }
});

  // Delete user favourites
router.delete('/:userName/favourites/:movieId', (req, res, next) => {
    const userName = req.params.userName;
    const movieId = req.params.movieId;
    Movie.findByMovieDBId(movieId).then(movie => {
        User.findByUserName(userName).then(user => {
            const favIndex = user.favourites.indexOf(movie._id);
            favIndex > -1 ? user.favourites.splice(favIndex, 1) : user;
            user.save().then(user => res.status(200).send(user));
        }).catch(next);
    }).catch(next);
});

export default router;