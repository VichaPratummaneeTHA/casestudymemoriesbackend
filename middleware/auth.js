import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {

  try {
    const tokenFromFrontend = req.headers.authorization.split(" ")[1];
    const isCustomAuth = tokenFromFrontend.length < 500;

    let decodedData;

    if(tokenFromFrontend && isCustomAuth){
      decodedData = jwt.verify(tokenFromFrontend, 'test')

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(tokenFromFrontend)

      req.userId = decodedData?.sub;
    }
    
    next();

  } catch (error) {
    console.log(error)
  }
}

export default auth;