var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const passport = require('passport');
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
const upload = require('./multer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get("/feed",isLoggedIn, async function(req,res,next){
  const user=await userModel.findOne({username: req.session.passport.user});
  const posts=await postModel.find()
  .populate("user")

  res.render('first', {user,posts});
  
});

router.post("/upload",isLoggedIn, upload.single('postimage'), async function(req,res,next){
  if(!req.file){
    return res.status(404).send("No files given.");
  }
  const user= await userModel.findOne({username: req.session.passport.user});
  const post= await postModel.create({
    image: req.file.filename,   
    title:req.body.title,
    description:req.body.description,
    user: user._id
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});
router.get("/profile",isLoggedIn,async function(req,res,next){
  const user=await userModel.findOne({username: req.session.passport.user})
  .populate("posts")
  res.render('profilecard', {user});
});
router.get("/add",isLoggedIn,async function(req,res,next){
  const user=await userModel.findOne({username: req.session.passport.user})
  res.render('add', {user});
});
router.get("/login", function(req,res,next){
  res.render('login', {error: req.flash('error')});
});
router.post("/fileupload", isLoggedIn, upload.single('image'), async function(req,res,next){
  const user= await userModel.findOne({username: req.session.passport.user});
  user.profileImage=req.file.filename;
  await user.save();
  res.redirect("/profile");
})
//register route

router.post("/register", function(req,res){
  var userdata = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullName:req.body.fullName,
    
  });

  userModel.register(userdata, req.body.password)
   .then(function(registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile');
    })
  })
});

//log innnnnnnnnnnnnnnnnnm

router.post("/login",passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash:true,
}), function (req,res) {  

});

router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if(err){return next(err); }
    res.redirect('/login');
  });
}); 

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}



module.exports = router;


