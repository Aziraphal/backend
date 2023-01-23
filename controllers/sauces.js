const Sauce = require('../models/sauceSchema')
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const hotSauce = JSON.parse(req.body.sauce);
  delete hotSauce._id;
  delete hotSauce._userId;
  const sauce = new Sauce({
    ...hotSauce,
    userId: req, auth, userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
  .then(() => {res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => {res.status(400).json ({error})})
  };

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const hotSauce = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : {
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat,
        userId: req.body.userId,
      };

  if (
    !regex.test(hotSauce.name) ||
    !regex.test(hotSauce.manufacturer) ||
    !regex.test(hotSauce.description) ||
    !regex.test(hotSauce.mainPepper) ||
    !regex.test(hotSauce.heat)
  ) {
    return res
      .status(500)
      .json({ error: "Des champs contiennent des caractères invalides" }); // Checking from form input values format before dealing with them
  }

  Sauce.updateOne(
    { _id: req.params.id },
    {
      ...hotSauce,
      _id: req.params.id,
    }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
       .then(sauce => {
           if (sauce.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = sauce.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Sauce.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};