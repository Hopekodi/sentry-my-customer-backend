const express = require("express");
const passport = require("passport");
const router = express.Router();

//landing page route
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

//dashboard page route
router.get(
  "/google/callback",
  passport.authenticate("google", {failureRedirect: "/"})
  ,(req,res)=>{
      res.redirect('/dashboard')
  }
);

//lockout user 

router.get('/logout',(req,res)=>{
    req.logOut()
    res.redirect('/')
})
module.exports = router;
