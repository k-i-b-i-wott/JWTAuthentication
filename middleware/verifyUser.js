import jwt from 'jsonwebtoken';
function verifyUser(req, res, next) {

    const token = req.cookies.token;
    // console.log(token);
    
    jwt.verify(token, process.env.JWT_SECRET_KEY,(err,data)=>{
               if(err){
                return res.status(401).json({message:"Unauthorized"})
               } else{
                req.user = data;
                next();
                
               }
    })
    
    ;

    
}

export default verifyUser;