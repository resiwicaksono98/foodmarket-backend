/** @format */

const jwt = require("jsonwebtoken");
const config = require("../app/config");
const User = require("../app/user/model");

const verifyUser = async (req, res, next) => {
   if (!req.session.token) return res.status(401).json({ message: "Please login your account" });
   let token = req.session.token;
   if (!jwt.JsonWebTokenError) return res.status(401).json({ msg: "Please login your account" });
   req.user = jwt.verify(token, config.secretKey);
   let user = await User.findOne({ token: { $in: [token] } });
   if (!user) {
      res.status(500).json({
         error: 1,
         message: "Token Expired",
      });
   }
   next();
};
// function decodeToken() {
//   return async function (req, res, next) {
//     try {
//       let token = getToken(req.session.token);
//       if (!token) return next();
//       req.user = jwt.verify(token, config.secretKey);
//       let user = await User.findOne({ token: { $in: [token] } });
//       if (!user) {
//         res.json({
//           error: 1,
//           message: "Token Expired",
//         });
//       }
//     } catch (err) {
//       if (err && err.name === "JsonWebToken") {
//         return res.json({
//           error: 1,
//           message: err.message,
//         });
//       }
//       next(err);
//     }
//     return next();
//   };
// }

// Policy Check

module.exports = { verifyUser };
