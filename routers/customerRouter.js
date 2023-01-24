const router = require("express").Router();
const Customer = require("../model/customerModel");
const auth = require("../middleware/auth");


 // Create customer 
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    // Check for existing name Validation
    const existingCustomer = await Customer.findOne({ name: name });
    if (existingCustomer)
      return res
        .status(400)
        .json({ errorMessage: `An account with this email already exists` });

    // create newUser and savedUser to database
    const newCustomer = new Customer({
      name,
    });
    const savedCustomer = await newCustomer.save();

    res.json(savedCustomer);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

  // Get all customer
  router.get("/",  async (req, res ) => {
    try{
        const customerList = await Customer.find();

        res.json(customerList);
    } catch (err) {
      console.error(err);
      res
      .status(500)
      .send();
    }
  });



module.exports = router;
