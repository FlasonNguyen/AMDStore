const express = require("express"); //framework
const router = express.Router(); //chuc nang cua framework

const { validationResult } = require("express-validator"); //xac thuc request duoc gui tu client
const bcrypt = require("bcrypt"); //bam nho mat khau
const alert = require("alert");

const signInValidator = require("./validators/signInValidator");
const signUpValidator = require("./validators/signUpValidator");

const User = require("../models/User");

router.get("/", (req, res) => {
  alert("Hello");
  return res.send("LOGIN PAGE");
});
router.get("/signup", (req, res) => {
  return res.send("SIGN UP PAGE");
});
router.get("/signout", (req, res, next) => {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
});
router.post("/signin", signInValidator, (req, res) => {
  let result = validationResult(req);
  if (result.errors.length == 0) {
    let { email, password } = req.body;
    let user = undefined;
    User.findOne({ email: email })
      .then((u) => {
        if (!u) {
          return alert("User not found");
        }
        role = u.role;
        user = u;
        return bcrypt.compare(password, u.password);
      })
      .then((passwordVerified) => {
        if (!passwordVerified) {
          return alert("Wrong Password");
        }
        req.session._id = user._id;
        req.session.role = user.role;
        req.session.name = user.name;
        console.log(user);
        return res.redirect("/");
      })
      .catch((e) => {
        return res.redirect("/");
      });
  } else {
    let messages = result.mapped();
    let message = "";
    for (m in messages) {
      message = messages[m].msg;
      break;
    }
    return alert(message);
  }
});
router.post("/signup", signUpValidator, (req, res) => {
  let result = validationResult(req);
  let { email, password, phone, address, name } = req.body;
  console.log(result);
  if (result.errors.length == 0) {
    User.findOne({ email: email })
      .then((account) => {
        if (account) {
          return alert("This email already sign up");
        }
      })
      .then(() => bcrypt.hash(password, 10)) //bam mat khau
      .then((hashed) => {
        console.log(hashed);
        //hased mat khau dc ma hoa
        let user = new User({
          email: email,
          password: hashed,
          name: name,
          phone: phone,
          address: address,
        });
        req.session._id = user._id; //check session co phai da dang nhap hay chua
        req.session.role = user.role;
        req.session.name = user.name;
        user.save(); //luu lai
      })
      .then(() => {
        return res.redirect("/");
      })
      .catch((e) => {
        return alert("SIGN UP FAILED " + e.message);
      });
  }
});
module.exports = router;
