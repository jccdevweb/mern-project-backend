const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
try {
    //check token
  //console.log(req.cookies.token);
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });

  // check if verified token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
 
  req.user = verified.user;
  // exit out this middleware go  export 
  next();
} catch (err) {
  console.error(err);
  res
  .status(401)
  .json({errorMessage: "Unauthorized"});
}}
module.exports = auth;