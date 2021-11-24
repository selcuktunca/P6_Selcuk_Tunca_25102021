//Permet de hashé le mot de passe
const bcrypt = require('bcrypt');
//Permet l'echange secu de jeton, verif de l'integrité et de l'authenticité des données, l’information est échangée sous la forme d’un jeton signé afin de pouvoir en vérifier la légitimité.
const jwt = require('jsonwebtoken');
//Premet de crypter l'email dans la BDD
const Buffer = require('buffer/').Buffer;

const User = require('../models/User');

//Pour l'enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
//Fonction pour hashé/crypté un mot de passe, on l'execute 10 fois(tour de l'algorythme)    
    const mailBuffed = new Buffer.from(req.body.email);
    bcrypt.hash(req.body.password, 10) 
      .then(hash => {
        const user = new User({
          email: mailBuffed.toString('base64'),
//On enregistre le hash du mot de passe          
          password: hash              
        });
//On enregistre le new utilisateur        
        user.save()                    
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));//Si erreur
  };

  
//Pour connecter des utilisateurs existant
exports.login = (req, res, next) => {
  const mailBuffed = new Buffer.from(req.body.email);
//Touver un seul utilisateur de la base de donnée, avec l'objet filtre (email)   
    User.findOne({ email: mailBuffed.toString('base64') })
//On vérifie si on a recupéré un user ou non      
    .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
//Utilisation de bcrypt pour comparer le mot de passe envoyé par le user avec le hash du user qu'on a reçu a la vérification
        bcrypt.compare(req.body.password, user.password)
//On reçoi un boulean si la comparaison est valable ou non  
        .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
//La comparaison a retourner true, donc on renvoi un status 200 pour une requete OK, on revois un objet json qui contient un user_id et un TOKEN             
            res.status(200).json({
              userId: user._id,
//On appelle la fonction sign de JWT, pour 1ere argument les données qu'ont veux encoder (userId indentifiant utilisateur), 2eme argument
//c'est la clée secrete pour l'encodage, le 3eme arguent est un argument de configuration ou on va appliquer une expiration pour notre token
              token: jwt.sign(
                {userId: user._id},
                'RANDOM_TOKEN_SECRET',
                {expiresIn: '24h'}
              )
            });
          })
//Erreur serveur
          .catch(error => res.status(500).json({ error }));
      })
//Erreur serveur
      .catch(error => res.status(500).json({ error }));
  };