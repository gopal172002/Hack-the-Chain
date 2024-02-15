var express = require('express');
var router = express.Router();
const userModel=require("./users");
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

router.post("/login",passport.authenticate("local",{
  successRedirect:"/home",
  failureRedirect:"/login",
  failureFlash:true
}) , function(req,res){});

router.get("/login",function(req,res){
  res.render("login",{error:req.flash('error')});
});
router.get("/home", isLoggedIn, async function(req,res){
  // res.render("home",{error:req.flash('error')},users);
  const user=await userModel.findOne({username:req.session.passport.user});
  res.render('home', {footer: true,user});
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
