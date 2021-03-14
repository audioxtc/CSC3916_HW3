var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//mongoose.Promise = global.Promise;

var actorlist = [];

try {
    mongoose.connect( process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected"));
}catch (error) {
    console.log("could not connect");
}
mongoose.set('useCreateIndex', true);

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
    actors: [Actor]

});

var Movie = mongoose.model('Movie', movieSchema);
var Actor = mongoose.model('Actor', actorSchema);

module.exports = Movie;
module.exports = Actor;
