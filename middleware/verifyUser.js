import jwt from 'jsonwebtoken';
function verifyUser(req, res, next) {

    const token = req.cookies.token;
    
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });

   
}

export default verifyUser;