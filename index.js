const express = require("express");
require('dotenv').config();

const mongoose = require('mongoose');
const urlRoute = require('./routes/url.router.js');
const URL = require('./models/url.model.js');

const app = express();
const PORT = process.env.PORT;

//Database (Mongodb) connection 
async function ConnectMongoDB() {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
            .then(() => console.log('MongoDB Connected'))
            .catch((err) => console.log('MongoDB connection error', err))
}

ConnectMongoDB();

app.use(express.json());

app.use("/url", urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            }
        }
    );
    res.redirect(entry.redirectURL);
})

app.listen(PORT, () => console.log(`Server is running at PORT:${PORT}`));

