const router = require("express").Router();
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register
router.post("/create", async (req, res) => {
  try {
    const { email, password, passwordVerify } = req.body;
    // validation
    if (!email || !password || !passwordVerify)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all require field" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ errorMessage: "Password must be 6 characters above" });

    if (password !== passwordVerify)
      return res
        .status(400)
        .json({ errorMessage: `Password did not match Password Verify` });

    // Check existing email in mongoDB (database)
    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ errorMessage: `An account with this email already exists` });

    // hash the password encrypt password with bcrypt to hide original password in database
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // create newUser and savedUser to database
    const newUser = new User({
      email,
      passwordHash,
    });

    const savedUser = await newUser.save();

    // sign the token
    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      process.env.JWT_SECRET
    );

    // send the token in a HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get('/', async(req,res) => {
  try{
    const getUser = await User.find();
    res.json(getUser);
  }catch(err){
    console.error(err)
    res
    .status(500)
    .json({errorMessage: "error"})
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // validation
    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all require field" });
    
    const existingUser = await User.findOne({email: email});
    if(!existingUser)
    return res
    .status(401)
    .json({errorMessage: "Wrong email or password."});

    const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
    if(!passwordCorrect) 
    return res 
    .status(401)
    .json({errorMessage: "Wrong email or password"});


    // sign the token
    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECRET
    );

    // send the token in a HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();

  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// logout user
router.get("/logout", (req, res) =>{
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)
  })
  .send();
});

  // when loggedin loggedin page only
router.get("/loggedin", (req, res) => {
  try{
    const token = req.cookies.token;
    if(!token) return res.json(false);

    jwt.verify(token, process.env.JWT_SECRET)
    
    res.send(true);
  } catch (err){
    res.json(false);
  }
});
module.exports = router;
