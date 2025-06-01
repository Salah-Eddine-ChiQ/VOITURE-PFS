// routes/voitureRoutes.js
const express = require('express');
const router  = express.Router();
const { authenticateClient } = require('../Middlewares/authMidleware');
const { 
  getAllVoituresEtReservations, 
  createCar, 
  getAllVoitures
} = require('../Controllers/voiturecontroller');

const upload = require('../Middlewares/multer');

// POST - Création d'une nouvelle voiture
router.post('/',upload.single('image'), authenticateClient, createCar);

// GET - Voitures et réservations
router.get('/AllVoituresEtReservations', getAllVoituresEtReservations);

router.get('/AllVoitures',getAllVoitures);



module.exports = router;
