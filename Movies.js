var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Actor = require('./Actors');

//mongoose.Promise = global.Promise;

var actorlist = [];

try {
    mongoose.connect( process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected"));
}catch (error) {
    console.log("could not connect");
}
mongoose.set('useCreateIndex', true);

var actor = new Actor();

//create a schema
var movieSchema = new Schema({

    title: String,
    year: String,
    //Action, Adventure, Comedy, Drama, Fantasy, Horror, Mystery, Thriller,
    //         Western
    genre: String,
    //must have at least three
    //actors: [{actorName: String, characterName: String}]

});

var Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;

