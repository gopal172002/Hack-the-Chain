var express = require('express');
var router = express.Router();
const userModel=require("./users");
const complaintModel = require("./complaints")
const passport=require("passport");


const localStratergy=require("passport-local");
const users = require('./users');
passport.use(new localStratergy(userModel.authenticate()));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Express' });
});




//Register Route
router.post('/register', (req, res) => {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullName: fullname });

  userModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("home");
      });
    })
    .catch(function (err) {
      // Handle any registration errors here
      console.error("Registration error:", err);
      res.redirect("/register"); // Redirect to a registration error page or form
    });
});

router.get("/login",function(req,res){
  res.render("login",{error:req.flash('error')});
});
router.post("/login",passport.authenticate("local",{
  successRedirect:"/home",
  failureRedirect:"/login",
  failureFlash:true
}) , function(req,res){

});

router.get("/home", isLoggedIn, async function(req,res){
  // res.render("home",{error:req.flash('error')},users);
  const user=await userModel.findOne({username:req.session.passport.user});
  res.render('home', {footer: true,user});
});

router.post('/createComplaint', async function(req, res) {
    const user=await userModel.findOne({username:req.session.passport.user});
  
    const complaint=await complaintModel.create({
      createdBy:user._id,
      title:req.body.title,
      content:req.body.content,
    })
  
      user.complaints.push(complaint._id);
      await user.save();
      // res.redirect('/home');
      res.json(complaint);
  });

  router.get("/allcomplaint", async function(req, res) {
    const complaints = await complaintModel.find().populate("createdBy");


    console.log("req.session:", req.session);
    console.log("req.session.passport:", req.session.passport);
    // console.log("req.session.passport.user:", req.session.passport.user);


    // const user = await userModel.findOne({ username: repassportq.session..user });
    // console.log(user);
    // res.render('allcomplaint', { complaints, user }); // Pass 'user' object here
    res.send("ok");
});


router.get("/logout",function(req,res){
  req.logout(function(err){
    if(err){ return next(err); }
    res.redirect("/login");
  });
});



function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}


module.exports = router;
