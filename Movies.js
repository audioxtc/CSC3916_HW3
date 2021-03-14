var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var actorlist = [];


var actorSchema = new Schema({
    actorName: String,
    characterName: String
});

//create a schema
var movieSchema = new Schema({
    title: String,
    year: String,
    //Action, Adventure, Comedy, Drama, Fantasy, Horror, Mystery, Thriller,
    //         Western
    genre: String,
    //must have at least three
    actors: actorlist

});

var Movie = mongoose.model('Movie', movieSchema);
var Actor = mongoose.model('Actor', actorSchema);

module.exports = Movie;
module.exports = Actor;
