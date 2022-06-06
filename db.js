const mongoose = require("mongoose");
const trackSchema = new mongoose.Schema({
    event: String,
    tags: [String],
    url: String,
    title: String,
    ts: String,
});

let Tracks;

async function connect() {
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
    Tracks = mongoose.model("Tracks", trackSchema);
}

async function insertTracks(tracks) {
    try {
        await Tracks.insertMany(tracks);
    } catch (error) {
        console.error("Unable to insert tracks to DB", { error });
    }
}

module.exports = {
    connect,
    insertTracks,
};
