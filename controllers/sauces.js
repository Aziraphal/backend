const Sauce = require('../models/sauceSchema');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const hotSauce = JSON.parse(req.body.sauce);
  delete hotSauce._id;
  const sauce = new Sauce({
    ...hotSauce,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [' '],
    usersDislikes: [' '],
  }); 
  sauce
  .save()
  .then(() => {res.status(201).json({message: 'Sauce enregistrée !'})})
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

exports.modifySauce = (req, res) => {
  let hotSauce = {};
  req.file ? (
      Sauce.findOne({_id: req.params.id})
          .then(sauce => {
              if(sauce.userId !== req.auth.userId){
                  res.status(403).json({message: `Non autorisé !`})
              } else {
                  const filename = sauce.imageUrl.split("/").at(-1);
                  fs.unlinkSync(`images/${filename}`)
              }
          }),
      hotSauce = {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
          }
      ) : sauceObject = {...req.body};
  Sauce.updateOne({_id: req.params.id},{...sauceObject, _id: req.params.id})
      .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
      .catch((error) => res.status(400).json({error}))
};

exports.deleteSauce = (req, res) => {
  console.log(req.auth)
  Sauce.findOne({ _id: req.params.id })
  .then (sauce => {
    console.log('sauce:', sauce);
    if (sauce.userId !== req.auth.userId) {
        res.status(403).json({message: `Non autorisé`});
      } else {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: `Sauce supprimée !` }))
          .catch((error) => res.status(400).json({ error }));
      });
    }})
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then(
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

exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id
  
  switch (like) {
    case 1 :
        Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
          .then(() => res.status(200).json({ message: `J'aime` }))
          .catch((error) => res.status(400).json({ error }))
            
      break;

      case 0:
        Sauce.findOne({ _id: sauceId })
          .then((sauce) => {
            if (sauce.usersLiked.includes(userId)) {
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
                .then(() => res.status(200).json({ message: `Neutre` }))
                .catch((error) => res.status(400).json({ error }))
            } else if (sauce.usersDisliked.includes(userId)) {
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
                .then(() => res.status(200).json({ message: `Neutre` }))
                .catch((error) => res.status(400).json({ error }))
            }
          })
          .catch((error) => res.status(404).json({ error }))
      break;

    case -1 :
        Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
          .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
          .catch((error) => res.status(400).json({ error }))
      break;
      
      default:
        console.log(error);
  }
}