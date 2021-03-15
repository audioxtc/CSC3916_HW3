/*
CSC3916 HW3
File: Server.js
Description: Web API scaffolding for Movie API
 */

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');
var Movie = require('./Movies');
var Actor = require('./Actors');
var ObjectID = require('mongodb').ObjectID;

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

router.post('/signup', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function (err) {
            if (err) {
                if (err.code == 11000)
                    return res.json({success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);
            }

            res.json({success: true, msg: 'Successfully created new user.'})
        });
    }
});

router.post('/signin', function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({username: userNew.username}).select('name username password').exec(function (err, user) {
        if (err) {
            res.send(err);
        }

        user.comparePassword(userNew.password, function (isMatch) {
            if (isMatch) {
                var userToken = {id: user.id, username: user.username};
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json({success: true, token: 'JWT ' + token});
            } else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        })
    })
});

//implement movie route
router.route('/movies')
    .get(authJwtController.isAuthenticated, function (req, res) {
        console.log(req.body);
        //var movie = new Movie();
        Movie.find({}, function(err, movies){
            if (err) {
                res.status(405).send(err);
                console.log(movies);
            }
            else{
                var o = getJSONObjectForMovieRequirement(req);
                res = res.status(200);
                o.body = {msg: [movies]};
                res.json(o);
            }
        })

    }).put(authJwtController.isAuthenticated, function (req, res) {
        movie = new Movie();
        movie.findById({id: req.body.id}, function(err, movie){
            if (err){
                res.status(405).send(err)
            }
            else {
                movie.leadActors = req.body.leadactors;
                movie.title = req.body.title;
                movie.year = req.body.year;
                movie.genre = req.body.genre;
                //movie.id = req.body.movieid;
                var o = getJSONObjectForMovieRequirement(req);
                res = res.status(200);
                o.body = {msg: "movie updated."}
                res.json(o);
            }
        })
        console.log(req.body);

        if (req.get('Content-Type')) {
            res = res.type(req.get('Content-Type'));
        }
        var o = getJSONObjectForMovieRequirement(req);
        o.body = {msg: "movie updated."}
        res.json(o);
    }
).delete(authController.isAuthenticated, function (req, res) {
        console.log(req.body);
        Movie.findOneAndDelete()
        res = res.status(200);
        if (req.get('Content-Type')) {
            res = res.type(req.get('Content-Type'));
        }
        var o = getJSONObjectForMovieRequirement(req);

        o.body = {msg: "movie deleted."}
        res.json(o);
    }
).post(authJwtController.isAuthenticated, function (req, res) {
        console.log(req.body);
        var movie = new Movie();
        movie.leadActors = req.body.leadactors;
        movie.title = req.body.title;
        movie.year = req.body.year;
        movie.genre = req.body.genre;
        //movie.id = req.body.movieid;
        movie.save(function (err)  {
            if (err) {
                res.status(405).send(err)
            }
            else {
                var o = getJSONObjectForMovieRequirement(req);
                res = res.status(200);
                o.body = {msg: "movie saved."};
                res.json(o);
            }
        });
        //console.log('Movie saved.');
    }
).all(function (req, res) {
        res.status(405).send({success: false, msg: 'HTTP method not implemented.'})
    }
);

router.put('/movies/:id', authJwtController.isAuthenticated, function(req, res, next) {

    var id = req.params.id;
    console.log(id);
    movie = new Movie();
    //var o_id = new ObjectID();
    movie.findById(id, function(err, movie){
        if (err){
            res.status(405).send(err)
        }
        else {
            movie.leadActors = req.body.leadactors;
            movie.year = req.body.year;
            movie.genre = req.body.genre;
            console.log(movie);
            var o = getJSONObjectForMovieRequirement(req);
            res = res.status(200);
            o.body = {msg: "movie updated."}
            res.json(o);
        }
    })
})

app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only


