const express = require("express");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require("path");

const urlRoute = require('./routes/url.router.js');
const staticRouter = require('./routes/static.router.js')
const userRoute = require("./routes/user.router.js")
const URL = require('./models/url.model.js');
const { checkForAuthentication, restrictTo } = require('./middlewares/auth.middleware.js')

const app = express();
const PORT = process.env.PORT;

//Database (Mongodb) connection 
async function ConnectMongoDB() {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
            .then(() => console.log('MongoDB Connected'))
            .catch((err) => console.log('MongoDB connection error', err))
}

ConnectMongoDB();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use("/url", restrictTo(["NORMAL"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRouter);


app.get('/url/:shortId', async (req, res) => {
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

