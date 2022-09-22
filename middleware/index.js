const { getToken, policyFor } = require("../utils")
const jwt = require('jsonwebtoken')
const config = require('../app/config')
const User = require('../app/user/model')


function decodeToken() {
    return async function (req, res, next) {
        try {
            let token = getToken(req)
            if (!token) return next()
            req.user = jwt.verify(token, config.secretKey)
            let user = await User.findOne({ token: { $in: [token] } })
            if (!user) {
                res.json({
                    error: 1,
                    message: 'Token Expired'
                })
            }
        } catch (err) {
            if (err && err.name === 'JsonWebToken') {
                return res.json({
                    error: 1,
                    message: err.message
                })
            }
            next(err)
        }
        return next()
    }
}

// Policy Check
function police_check(action, subject){
    return function(req,res,next) {
        let policy = policyFor(req.user)
        if(!policy.can(action, subject)){
            return res.json({
                error: 1,
                message: `You Are Not Allowed To ${action} ${subject}`
            })
        }
        next()
    }
}


module.exports = { decodeToken , police_check}
