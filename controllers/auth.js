const User = require('../models/user');
const { createJwt, attachCookiesToResponse } = require('../utils/jwt');
const createTokenUser = require('../utils/createTokenUser');


let register = async (req,res)=>{
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
        return res.status(400).json({ 
            msg: 'fill all the credentials',
         })
    }
    const emailExist  = await User.findOne({email});
    if(emailExist){
        return res.status(400).json({ msg: 'email already exist' });
    }


    
    const isFirstAccount = (await User.countDocuments({})) === 0;


    
    const role = isFirstAccount ? 'admin' : 'user';

    
    const user =  await User.create({name,email,password,role});


    
    const userForToken = createTokenUser(user);

    
    
    attachCookiesToResponse({res,user:userForToken});

    res.status(200).json({ msg: 'user created',userForToken });
}
let login  = async  (req,res)=>{    
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'fill all the credentials' })
        }

        const user  = await User.findOne({email});
        if(!user){
            return res.status(400).json({ msg: 'no user found' })
        }
        if (!user.comparePassword(password)) {
            return res.status(400).json({ msg: 'incorrect password' })
        }    


        
        const userForToken = createTokenUser(user);

        
        

        
        attachCookiesToResponse({res,user:userForToken});    
        res.status(200).json({ msg : "user logged in Successfully ", userForToken })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'something went wrong',error })
        
    } 
}

const logout = async (req, res) => {
 try {
    
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
      });
      res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
 } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'something went wrong',error })
 }
};

module.exports = {
    login,
    register,
    logout
}


