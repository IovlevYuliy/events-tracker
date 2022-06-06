const fs = require("fs").promises;
const express = require("express");
const bodyParser = require("body-parser");
const { StatusCodes } = require("http-status-codes");
const db = require("./db");

const app = express();
const sriptSender = express();
const port = Number(process.env.PORT);

app.use(bodyParser.json());
app.use(bodyParser.text());

app.get(/^\/$|^\/1.html$|^\/2.html$/, async (req, res) => {
    try {
        const htmlContent = await fs.readFile("./public/index.html");
        res.send(htmlContent.toString());
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Could not get page content ${err}`);
    }
});
app.post("/track", async (req, res) => {
    let receivedData = req.body;
    if (req.is("text/*")) {
        receivedData = JSON.parse(receivedData);
    }

    db.insertTracks(receivedData);
    res.sendStatus(StatusCodes.OK);
});

//-------- INDIVIDUAL PORT FOR SENDING SCRIPT ----------------//
sriptSender.get("/", async (req, res) => {
    try {
        const trackerScriptContent = await fs.readFile("./public/tracker.js");
        res.send(trackerScriptContent.toString());
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
            `Could not send tracker\'s script ${err}`
        );
    }
});

(async () => {
    try {
        await db.connect();
        app.listen(port, () => console.log(`First service listening at port ${port}`));
        sriptSender.listen(port + 1, () =>
            console.log(`Second service listening at port ${port + 1}`)
        );
    } catch (err) {
        console.error(err);
    }
})();
