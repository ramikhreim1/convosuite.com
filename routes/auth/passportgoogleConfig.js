const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/user");
const member = require("../models/member");
// const stripe = require("../middlewares/stripe");
const { v4 } = require("uuid");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: `${process.env.DOMAIN}api/auth/google/callback`,
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        // console.log("profile", profile);
        try {
          let existingUser = await User.findOne({ googleId: profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }

          existingUser = await User.findOne({ email: profile.email });
          if (existingUser) {
            return done(null, existingUser);
          }
          console.log("Creating new user...");

          // const customer = await stripe.customers.create({
          //     email: `${profile.email}`,
          //     name: profile.displayName
          // // });

          // let referrerObj = {}

          // if (request.query.state) {
          //     let referrer = await User.findOne({
          //         referralId: `${request.query.state}`
          //     });
          //     if (referrer) {
          //         referrerObj = {
          //             referrer: referrer._id
          //         }
          //     }
          // }

          // console.log("referrer : ", referrerObj);
          let invitee = await member.findOne({ email: profile.email });
          if (!invitee) return done("User not found", null);
          const newUser = new User({
            email: profile.email,
            fname: profile.name.givenName,
            lname: profile.name.familyName,
            // customerId: customer.id,
            googleUser: true,
            googleId: profile.id,
            imageUrl: profile.picture,
            password: "google_user",
            admin: invitee.admin,
            // referralId: v4(),
            // ...referrerObj
          });
          const [savedUser, admin] = await Promise.all([
            newUser.save(),
            User.findById(invitee.admin),
          ]);

          // save userId and update the admin
          await Promise.all([
            member.findByIdAndUpdate(invitee._id, {
              status: "active",
              userId: savedUser._id,
            }),
            User.findByIdAndUpdate(admin._id, {
              users: [...admin.users, savedUser._id],
            }),
          ]);

          return done(null, newUser);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};
