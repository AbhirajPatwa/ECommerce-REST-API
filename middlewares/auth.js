const { isTokenValid } = require('../utils/jwt');

const authMiddleware = async (req, res, next) => {

  
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  
  else if (req.cookies.token) {
    token = req.cookies.token;
  }



  if (!token) {
    return res.status(401).json({ msg: 'you are not authorized' });
  }
  try {
    const payload = isTokenValid(token);

    

    req.user = {
      userId: payload.user.userId,
      role: payload.user.role,
    };

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: 'something went wrong ',error });
    }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'you are not allowed to do this' });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };