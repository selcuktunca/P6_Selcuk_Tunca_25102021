const express = require('express');
const router = express.Router();


const saucesCtrl = require('../controllers/sauces');


//On ajoute auth sur les routes que l'on veux proteger
const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');


//Creer un objet avec post
router.post('/', auth, multer, saucesCtrl.createSauce);
 
//Modif d'un objet existant
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

 //Suprimer un objet existant
router.delete('/:id',auth, saucesCtrl.deleteSauce);

//Recup un objet specifique avec sont id
router.get('/:id', auth, saucesCtrl.getOneSauce);

//Recup tout les objets
router.get('/', auth, saucesCtrl.getAllSauce);



module.exports = router;