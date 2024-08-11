const whitelist = require("../config/allowedOrgins");

const credentials = (req, res, next)=> {
    const origin = req.headers.origin;
    if(whitelist.includes(origin)){
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials
