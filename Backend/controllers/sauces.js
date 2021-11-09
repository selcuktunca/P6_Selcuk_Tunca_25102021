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
      //like / dislike/ userlike/userdislike
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
//Une fois le fichier suprimer on suprime le thing de la base de donée
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

