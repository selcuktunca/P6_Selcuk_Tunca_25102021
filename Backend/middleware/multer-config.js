const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//On crée on objet de configuration pour multer, on utilise la foncion diskStorage pour dire que on enregistre sur le disque 
const storage = multer.diskStorage({
//fonction destination qui explique a multer ou enregistrer les fichiers
    destination: (req, file, callback) => {
    callback(null, 'images');
  },
//fonction filname qui explique a multer quel nom de fichier utiliser (pour eviter les noms de fichier similaire)
  filename: (req, file, callback) => {
//Création du nom, on utilise le nom d'origine, et on elemine les espace par des '_'
    const name = file.originalname.split(' ').join('_');
//Pour générer l'extention du fichier ave les MIME_TYPES
    const extension = MIME_TYPES[file.mimetype];
//On appelle le callback et on crée le filename, Date.now ajoute un time stamp, ajoute un '.' et l'extenssion du fichier    
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');