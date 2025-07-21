if (process.env.NODE_ENV != "production") {
    require("dotenv").config();// requiring dotenv package 
}

const express = require("express");

const app = express();

const mongoose = require("mongoose");

const path = require("path");

const methodOverride = require("method-override");

const ejsMate = require("ejs-mate");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "/public")));

const listingsrouter = require("./routes/listing.js");

const reviewsrouter = require("./routes/review.js");

const userRouter = require("./routes/user.js")

const session = require("express-session");//requiring express-session package

const MongoStore = require('connect-mongo');// requiring mongo-session storage through connect-mongo package

const flash = require("connect-flash");// requiring connect-flash package


const passport = require("passport");// requiring passport package

const LocalStrategy = require("passport-local");//  requiring passport-local package

const User = require("./models/user.js");//requiring user Model for authentication


let Atlas_Url = process.env.ATLAS_DB;

async function main() {
    await mongoose.connect(Atlas_Url);
}


main()
    .then(() => {
        console.log("connected to db");
    })
    .catch(err => console.log(err));

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

// Method used to create new Mongo session store

const store = MongoStore.create({
    mongoUrl: Atlas_Url,
    crypto: {// to encrypt our secret 
        secret: process.env.SECRET
    },
    touchAfter: 24 * 60 * 60// in seconds 
})

// store.on is used to display error if error occurs in mongo atlas session store 

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE", err)
})

// Root Route 

app.get("/", (req, res) => {
  res.redirect("/listings"); // Or render a homepage if you have one
});

// using session middleware for creating express session 

app.use(session({
    store,// to store session inside mongo atlas 
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 3 * 24 * 60 * 60 * 1000,// expire date is set after 3 days
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}))

app.use(flash());// using flash middleware

// passport middleware

app.use(passport.initialize());// initialising passport

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

app.use("/listings", listingsrouter);

app.use("/listings/:id/reviews", reviewsrouter);

app.use("/", userRouter);

// error handling middleware

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    // res.status(status).send(message);
    res.render("listings/Error.ejs", { message });
})

app.listen(8080, () => {
    console.log("server is listening to port 8080");
})

