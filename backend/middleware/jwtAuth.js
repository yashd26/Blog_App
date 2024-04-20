const jwt = require("jsonwebtoken");
const User = require("../models/users.models")

const verifyJWT = async function(req, res, next) {
    const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({error: 'Authorization token required'})
  }

  const token = authorization.substring(13);

  try {
    const { _id, email, firstName } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findOne({ _id }).select('_id')
    req.user = await User.findOne({ _id }).select('email')
    req.user = await User.findOne({ _id }).select('firstName')

    next()

  } catch (error) {
    res.status(401).json({error: 'Request is not authorized'})
  }
}

module.exports = {verifyJWT}
