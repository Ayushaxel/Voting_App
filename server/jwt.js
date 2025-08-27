const jwt = require('jsonwebtoken');

const generateToken =(user)=>{
    return jwt.sign(user, process.env.JWT_SECRET);
}

const jwtMiddleware = (req, res, next)=>{
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({message: 'Unauthorized'});
    const token = authorization.split(' ')[1];
    if(!token) return res.status(401).json({message: 'Unauthorized'});
    const decoded=jwt.verify(token, process.env.JWT_SECRET);
    req.user=decoded;
    next();
}

module.exports={
    generateToken,
    jwtMiddleware
}