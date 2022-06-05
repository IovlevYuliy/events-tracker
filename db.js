const mongoose = require('mongoose');
const trackSchema = new mongoose.Schema({
    event: String,
    tags: [String],
    url: String,
    title: String,
    ts: String,
});

let Tracks;

async function connect() {
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
    Tracks = mongoose.model('Tracks', trackSchema);
}

async function insertTracks(tracks) {
    console.log(insertTracks, { tracks });
    await Tracks.insertMany(tracks);
}

module.exports = {
    connect,
    insertTracks,
};
