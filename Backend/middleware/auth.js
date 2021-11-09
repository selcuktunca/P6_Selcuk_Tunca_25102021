const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
//On récuper le token dans le header autorisation, on le split autour de l'espace, nous retourne un tableau avec le token en 2eme element
    const token = req.headers.authorization.split(' ')[1];
//On decode le token avec la fonction verify qui va verifier le token et la clée du token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
//On recuper le userId qui est dedans
    const userId = decodedToken.userId;
//On vérifie la correspondance de userId avec le token
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } 
//Si tout est ok on appelle next (le middleware sera appliquer avant les controlers de nos routes, donc pour chaque requete sur une route on passe par ce middleware )  
    else {
      next();
    }
  } 
//Gérer les erreurs 
    catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};