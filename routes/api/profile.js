const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
// const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator");
// const request = require("request");
const config = require("config");

// @route GET api/profile/me
// @desc GET current users profile
// @access Private (needs a token) , see use of auth middleware
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      // find the "user" in the profile db in MongoDB that pertains to the tokens id field
      // populate adds more fields
      // populate method takes in 2 params
      // which database , and what fields do you want to populate with
      "user",
      ["name", "balance"]
    );
    // remember the Profile schema has a user field
    // that is linked to the id of the "user" database
    // populate allows us to grab the name and balance from the "user" database
    // because the profile db doesnt have it

    if (!profile) {
      return res.status(400).json({ msg: "there is no such profile" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

// @route POST api/profile/
// @desc create or update user profile
// @access Private

router.post(
  "/",
  [auth, [check("interests", "interests required").not().isEmpty()]], // only check if interest is not empty
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // if no errors
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      location,
      bio,
      interests,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;
    // destructure and pull everything from req.body

    //build profile fields
    const profileFields = {}; //init object
    profileFields.user = req.user.id; // per above
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (interests) {
      profileFields.interests = interests.split(",").map((i) => i.trim());
    }
    if (youtube) profileFields.youtube = youtube;
    if (twitter) profileFields.twitter = twitter;
    if (facebook) profileFields.facebook = facebook;
    if (linkedin) profileFields.linkedin = linkedin;
    if (instagram) profileFields.instagram = instagram;

    try {
      // find existing profile
      let profile = await Profile.findOne({ user: req.user.id });
      //if exists
      if (profile) {
        //if no profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields }, //$set finds matching key and enter the values
          { new: true } // true means return modified doc rather than original
        );
        return res.json(profile);
      }
      // else, no existing profile, create one
      profile = new Profile(profileFields);
      // save into mongo
      await profile.save();
      //return the profile
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

// @route GET api/profile
// @desc  GET all profiles
// @access Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name"]);
    // the name field only exists in user,
    // which is linked to profile via
    // user: {
    //   type: mongoose.Schema.Types.ObjectId, // _id in mongoDB
    //   ref: "user", // refer to the user schema we created
    //   // module.exports = User = mongoose.model("user", UserSchema)
    res.send(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

// @route GET api/profile/user/user_id
// @desc  GET profile by user id
// @access Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    //findOne(key in DB, corresponding value match desired)

    if (!profile) {
      return res.status(400).json({ msg: "profile not found!" });
    }

    res.send(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      //err.kind attempts to match the key of the error, in this case, ObjectId/ userId is not valid
      return res.status(400).json({ msg: "profile not found!" });
    }
    res.status(500).send("server error");
  }
});

// @route PUT api/profile/experience (you could have POST as well) // put is really similiar in meaning to update
// @desc  add profile experience
// @access Private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "title needed").not().isEmpty(),
      check("company", "company is needed").not().isEmpty(),
      check("from", "from date is needed").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, from, to, current, description } = req.body; // pull out the fields from the request

    const newExp = {
      // put the new experience to a object
      title,
      company,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      // find the profile, the profile MUST exists since we got pass the auth middleware
      // thus no need to build for false scenarios

      profile.experience.unshift(newExp); //push new experience in front
      // note that the newExp forms a item in the experience array, with its own id!
      await profile.save();

      res.json(profile); // return the now updated profile
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// // @route DELTE api/profile
// // @desc  delete profile, user and posts
// // @access Private

// router.delete("/", auth, async (req, res) => {
//   try {
//     // remove user posts
//     await Post.deleteMany({ user: req.user.id });

//     await Profile.findOneAndRemove({ user: req.user.id });
//     await User.findOneAndRemove({ _id: req.user.id });
//     // there is no id field in USer db, only the default _id
//     // note that User id is copied onto Profile (field user) so they are the same
//     res.json({ msg: "user deleted" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("server error");
//   }
// });

// // @route DELETE api/profile/experience/:exp_id (you could have PUT as well)
// // @desc  delete profile experience
// // @access Private

// router.delete("/experience/:exp_id", auth, async (req, res) => {
//   try {
//     const profile = await Profile.findOne({ user: req.user.id });

//     const removeIndex = profile.experience
//       .map((item) => item.id)
//       .indexOf(req.params.exp_id);
//     //map experience into array (of item id), and then find the index of the array item matching the url parmas of exp_id

//     profile.experience.splice(removeIndex, 1);

//     await profile.save();

//     res.json(profile);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // //////////////////////////////////////////////////////////////////////////////

// // @route PUT api/profile/education (you could have POST as well)
// // @desc  add profile education
// // @access Private

// router.put(
//   "/education",
//   [
//     auth,
//     [
//       check("school", "degree").not().isEmpty(),
//       check("degree", "degree required").not().isEmpty(),
//       check("fieldofstudy", "field of study").not().isEmpty(),
//       check("from", "from date is required").not().isEmpty(),
//     ],
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { school, degree, fieldofstudy, from, to, current, description } =
//       req.body;

//     const newEdu = {
//       school,
//       degree,
//       fieldofstudy,
//       from,
//       to,
//       current,
//       description,
//     };

//     try {
//       const profile = await Profile.findOne({ user: req.user.id });

//       profile.education.unshift(newEdu); //push new education in front
//       await profile.save();

//       res.json(profile);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server Error");
//     }
//   }
// );

// // @route DELETE api/profile/education/:edu_id (you could have PUT as well)
// // @desc  delete profile education
// // @access Private

// router.delete("/education/:edu_id", auth, async (req, res) => {
//   try {
//     console.log(req);
//     const profile = await Profile.findOne({ user: req.user.id });

//     const removeIndex = profile.education
//       .map((item) => item.id)
//       .indexOf(req.params.edu_id);
//     //map education into array (of item id), and then find the index of the array item matching the url parmas of edu_id

//     profile.education.splice(removeIndex, 1);

//     await profile.save();

//     res.json(profile);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route GET api/profile/github/:username
// // @desc  GET user repos from Github
// // @access public
// router.get("/github/:username", (req, res) => {
//   try {
//     const options = {
//       uri: `https://api.github.com/users/${
//         req.params.username
//       }/repos?per_page=5&sort=created:asc&client_id=${config.get(
//         "githubClientId"
//       )}&client_secret=${config.get("githubSecret")}`,
//       method: "GET",
//       headers: { "user-agent": "node.js" },
//     };
//     console.log(options.uri);
//     request(options, (error, response, body) => {
//       if (error) console.error(error);
//       if (response.statusCode !== 200) {
//         res.status(404).json({ msg: "No github profile found" });
//       }

//       res.json(JSON.parse(body));
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

module.exports = router;
