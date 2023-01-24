const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
mongoose.set('strictQuery', true);
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

// set up Server
const app = express();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
app.get("/test", (req, res) =>{
  res.send(`Server Working`);
});

// parse read req.body as text in insomia
app.use(express.json());
app.use(cookieParser()); 
app.use(
  cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    }));

// connect to mongoDB (database)
mongoose.connect(process.env.MDB_CONNECT, (err) => {
  if (err) 
    return console.error(err);
    console.log(`Connected to MongoDB`)
});

// set up routes
app.use("/auth", require("./routers/userRouter"));
app.use("/customer", require("./routers/customerRouter"));
app.use("/member", require("./routers/memberApplication"))