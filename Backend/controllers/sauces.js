const Sauce = require('../models/Sauce');
//Pour avoir accée au differente operation liée au systheme de fichier 
const fs = require('fs'); 

exports.createSauce = (req, res, next) => {
//Objet JS sous forme de chaine de caractere, on analyse cette chaine et on la transforme en objet   
  const sauceObject =  JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
//Pour générer l'URL de l'image, le protocole, le nom d'hote, /image et / nome du fichier      
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [" "],
      usersDisliked: [" "],
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.modifySauce = (req, res, next) => {
//Si il y a une nouvelle image on aura un req.file, sinon on traite la requete comme objet  
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };
  

  exports.deleteSauce = (req, res, next) => {
//Avant de suprimer l'objet de la base, on vas le chercher pour avoir l'URL de l'image
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
//On recupere le nom précie du fichier
        const filename = sauce.imageUrl.split('/images/')[1];
//On utilise unlink pour suprimer un fichier        
        fs.unlink(`images/${filename}`, () => {
//Une fois le fichier suprimer on suprime la sauce de la base de donée
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  };

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };

exports.likeOrDislikeSauces = (req, res, next) => {
//Switch évalue une expression, selon le résultat éxécute l'instruction, l'expression est comparé avec chaque case
  const like = req.body.like;
  switch(like){
//Si l'utilisateur like la sauce    
    case 1:
//updateOne pour mettre a jour un seul document      
      Sauce.updateOne(
        {_id: req.params.id},
//$push pour ajouter une valeur spécifiée a un tableau
//$inc pour incrémenter un champ d'une valeur spécifiée, nous pouvons diminuer ou augmenter cette valeur
        { $push: {usersLiked: req.body.userId}, 
          $inc: {likes: +1} }
        )
          .then(() => res.status(200).json({message: "J'aime cette sauce"}))
          .catch((error) => res.status(400).json({ error }))

      break;
    
//Si l'utilisateur enleve un like ou un dislike
    case 0 :      
   console.log("le param id " + req.params.id);  
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
//Includes détermine si un le tableau contient une valeur  
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
              {_id: req.params.id},
//$Pull supprime du tableau les instances d'une valeur             
              { $pull: {usersLiked: req.body.userId},
                $inc: {likes: -1} }
            )
            .then(() => res.status(200).json({ message: "Pas d'avis" }))
            .catch((error) => res.status(400).json({ error }))
          }
          if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              {_id: req.params.id},
              { $pull: {usersDisliked: req.body.userId},
                $inc: {dislikes: -1}}
            )
            .then(() => res.status(200).json({ message: "Pas d'avis" }))
            .catch((error) => res.status(400).json({ error }))
          }
        })
        .catch((error) => res.status(404).json({ error }))
      
      break;
      
//Si l'utilisateur dislike la sauce
    case -1 :
      Sauce.updateOne(
        {_id: req.params.id},
        { $push: {usersDisliked: req.body.userId},
          $inc: {dislikes: +1}}
      )
      .then(() => res.status(200).json({ message: "Je n'aime pas cette sauce" }))
      .catch((error) => res.status(400).json({ error }))

      break;
//Si il n'y a aucune correspondance avec les cases    
    default:
      console.log(error);
    
  }
} 