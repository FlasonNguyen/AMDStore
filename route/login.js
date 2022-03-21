const express = require("express"); //framework
const router = express.Router(); //chuc nang cua framework

const { validationResult } = require("express-validator"); //xac thuc request duoc gui tu client
const bcrypt = require("bcrypt"); //bam nho mat khau

const signInValidator = require("./validators/signInValidator");
const signUpValidator = require("./validators/signUpValidator");

const User = require("../models/User");

router.get("/", (req, res) => {
  return res.send("LOGIN PAGE");
});
router.get("/signup", (req, res) => {
  return res.send("SIGN UP PAGE");
});
router.get("/signout", (req, res) => {
  req.session.destroy;
  return res.send("LOGOUT SUCCESS");
});
router.post("/signin", signInValidator, (req, res) => {
  let result = validationResult(req);
  let errors = [];
  if (result.errors.length == 0) {
    let { email, password } = req.body;
    let user = undefined;
    let role = undefined;
    User.findOne({ email: email })
      .then((u) => {
        if (!u) {
          errors.push({ msg: "User not found" });
        }
        role = u.role;
        user = u;
        return bcrypt.compare(password, u.password);
      })
      .then((passwordVerified) => {
        if (!passwordVerified) {
          errors.push({ msg: "Wrong Password" });
          return res.send(errors);
        }
        req.session._id = user._id;
        req.session.role = user.role;
        req.session.name = user.name;
        console.log(user);
        return res.send("LOGIN SUCCESS PHASE 2");
      })
      .catch((e) => {
        return res.send("LOGIN FAIL PHASE 2: " + e.message);
      });
  } else {
    let messages = result.mapped();
    let message = "";
    for (m in messages) {
      message = messages[m].msg;
      break;
    }
    errors.push({ msg: message });
    return res.send(errors);
  }
});
router.post("/signup", signUpValidator, (req, res) => {
  let result = validationResult(req);
  let errors = [];
  let { email, password, phone, address, name } = req.body;
  console.log(result);
  if (result.errors.length == 0) {
    User.findOne({ email: email })
      .then((account) => {
        if (account) {
          errors.push({ msg: "This email already sign up" });
          return res.send(errors);
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
        return res.send(" SIGN UP SUCCESS");
      })
      .catch((e) => {
        errors.push({ msg: "SIGN UP FAILED " + e.message });
      });
  }
});
module.exports = router;
