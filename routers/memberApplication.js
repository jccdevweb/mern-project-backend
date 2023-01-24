const router = require('express').Router();
const auth = require('../middleware/auth');
const MemberApplication = require('../model/MemberApplication.model')

// Create || addMember
router.post('/add', auth, async (req, res) =>{
  try{
    const {fullName, email, phone} = req.body
    const newMember = new MemberApplication ({fullName, email, phone})
   
    const savedMember = await newMember.save();

res.json(savedMember)
  }catch(err){
    res.status(400)
    .json({errorMessage : "error"})
  }
})

// router.route('/add').post(auth ,(req, res) => {
// const {fullName, email, phone} = req.body

//   const newMember = new MemberApplication({fullName, email, phone});

//   newMember.save()

//   .then(member => res.json('New Member Added!'))
//   .catch (err => res.status(400).json('error : ' + err))
// });

//home || getAllmember
router.route('/').get(auth,(req, res) => {
  MemberApplication.find()
  .then(member => res.json(member))
  .catch(err => res.status(400).json('error :' + err))
});

//get single memberDetails 
router.route('/:id').get(auth,(req, res) => {
  MemberApplication.findById(req.params.id)
  .then(member => res.json(member))
  .catch(err => res.status(400).json('error :' + err))
})

//Delete single memberDetails
router.route('/:id').delete(auth,(req, res) => {
  MemberApplication.findByIdAndDelete(req.params.id)
  .then(member => res.json('Member detail deleted'))
  .catch(err => res.status(400).json('error :' + err))
})

// update
router.route('/update/:id').post(auth,(req, res) => {
  MemberApplication.findById(req.params.id)
  .then(member => {
    member.fullName = req.body.fullName;
    member.email = req.body.email;
    member.phone = req.body.phone;

    member.save()
  
    .then((member)=> res.json(
     member))
    .catch (err => res.status(400).json('error : ' + err))
  })
    .catch(err => res.status(400).json('error :' + err))
});




module.exports = router;