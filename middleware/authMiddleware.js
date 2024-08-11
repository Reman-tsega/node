const JWT = require('jsonwebtoken')
const {accessTokenSecret } = require('../config/jwtConfig')

const authenticateToken = async (req,res,next)=>{
    const authHeaders = req?.headers['authorization']
    console.log(authHeaders);
    const token = authHeaders?.split(' ')[1];

    if(!token) return res.sendStatus(401);

    JWT.verify(
        token,
        accessTokenSecret,
        (err,user)=>{
            if(err) return res.sendStatus(403);
            req.user = user;
            next();
        }
    );


}

module.exports = authenticateToken;