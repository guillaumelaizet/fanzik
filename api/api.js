const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const mongodb = require('mongodb')
const path = require('path')
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
// var cookieParser = require('cookie-parser');

const Bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const nodemailer = require('nodemailer')

const eventful = require('eventful-node')
const client = new eventful.Client('KNTLkbbm3QH6vhQf')

const User = require('../models/user')
const Event = require('../models/event')
const Post = require('../models/post')

// const url = 'mongodb://localhost:27017/fanzik'
const url = 'mongodb://guiguizzz:lolo24041989@ds261521.mlab.com:61521/music'

const EventFul = 'http://api.eventful.com/js/api'

const adminId = '5c03b8bfbd890635ccaaf2ca'

router.use(cors())



mongoose.connect(url, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log('error : ' + err.stack)
    process.exit(1)
  } else {
    console.log('connected to database');
  }
});

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    console.log('no bearer')
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  // console.log(token)
  if (token === 'null') {
    console.log('no token')
    return res.status(401).send('Unauthorized request')
  }
  let payload = jwt.verify(token, 'secretKey')
  // console.log('enter verifyToken function');
  if (!payload) {
    console.log('payload not accepted')
    return res.status(401).send('Unauthorized request')
  }
  req.userId = payload.subject
  next()
}



// -------------------------------------------------------------------- Auths ----------------------------------------------------------


router.get('/verifyifduplicate/:data1/:data2', (req, res) => {
  User.findOne({pseudo: req.params.data1}, (err, user1) => {
    if (err) {
      console.log(err);
    } if (user1) {
      res.status(403).send('pseudo')
    } else if (!user1) {
      User.findOne({email: req.params.data2}, (err, user2) => {
        if (err) {
          console.log(err);
        } if (user2) {
          res.status(403).send('email')
        } else if (!user2) {
          res.json(user2)
        }
      })
    }
  })
})


router.post('/register', (req, res, next) => {
  let userData = req.body
  User.findOne({email: userData.email}, (err, user) => {
    if (err) {
      console.log(err);
    } if (user) {
      res.status(403).send('email already exists')
    } else {
      User.findOne({pseudo: userData.pseudo}, (err, user) => {
        if (err) {
          console.log(err)
        } if (user) {
          res.status(403).send('pseudo already exists')
        } else {
          Bcrypt.genSalt(10, (err, salt) => {
            if (err) {
              console.log(err);
            } else {
              Bcrypt.hash(userData.password, salt, (err, hash) => {
                if (err) {
                  console.log(err);
                } else {
                  userData.password = hash
                  userData.connected = true
                  // let base64Data = req.body.avatar.replace(/^data:image\/jpeg;base64,/, "")
                  // // console.log(base64Data);
                  // const filename = `avatar-${Date.now()}.jpg`
                  // const path = `${__dirname}/../src/assets/uploads/`+ filename
                  //
                  // require("fs").writeFile(path, base64Data, 'base64', (err) => {
                  //   if (err) {
                  //     console.log(err);
                  //   }
                  // })
                  // userData.avatar = {avatarUrl: filename}
                  let user = new User(userData)
                  user.save((err, registeredUser) => {
                    if (err) {
                      console.log(err);
                    } else {
                      let payload = {subject: registeredUser._id}
                      let token = jwt.sign(payload, 'secretKey')

                      let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        secure: false,
                        port: 25,
                        auth: {
                          user: 'glaizet@gmail.com',
                          pass: 'Lolo24041989'
                        },
                        tls: {
                          rejectUnauthorized: false
                        }
                      })

                      let mailOptions = {
                        from:'"mrs mail center" <glaizet@gmail.com>',
                        to: registeredUser.email,
                        subject: 'welcome !',
                        text: 'Hello Wolrd',
                        html: 'Félicitation, ton compte a bien été crée'
                      }

                      transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                          return console.log(err)
                        }
                        console.log('Message sent: %s', info.messageId)
                        console.log('preview URL: %s',nodemailer.getTestMessageUrl(info))
                      })
                      console.log(registeredUser._id)
                      User.findByIdAndUpdate(registeredUser._id, {$push: {friends : {id: adminId, status: 'confirmed'}}}, {new: true}, (err, registeredUser) => {
                        if (err) {
                          return console.log(err)
                        } if (user) {
                          console.log(user)
                          User.findByIdAndUpdate(adminId, {$push : {friends : {id: registeredUser._id, status: 'confirmed'}}},  {new : true}, (err, user) => {
                            if (err) {
                              return console.log(err)
                            }
                          })
                          res.status(200).send({token, registeredUser})
                        }
                      })

                      // res.status(200).send({token, registeredUser})
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
})


router.post('/login', (req, res, next) => {
  let userData = req.body
  console.log(req.cookies)

  User.findOne({pseudo: userData.pseudo}, (err, user) => {
    if (err) {
      console.log(err)
    } else {
      if (!user) {
        res.status(403).send('Invalid pseudo')
      } else {
        User.findOneAndUpdate({pseudo: userData.pseudo}, {$set: {connected : true}}, (err, user) => {
          if (err) {
            console.log(err)
          } if (user) {
            Bcrypt.compare(userData.password, user.password, (err, result) => {
              if (err) {
                console.log(err);
                res.status(401).send('')
              }
              if (result) {
                if (user.deleted && user.deleted === true) {
                  res.status(401).send('deleted')
                } else {
                  let payload = {subject: user._id}
                  let token = jwt.sign(payload, 'secretKey')
                  res.status(200).send({token, user})
                }
              } else {
                res.status(403).send('invalid password')
              }
            })

          }
        })
      }
    }
  })
})

router.get('/logout/:id', (req, res) => {
  console.log(req.params.id)
  User.findOneAndUpdate({_id: req.params.id}, { $set: { connected: false}}, (err, user) => {
    if (err) {
      console.log(err)
    } if (user) {
      res.status(200).send({text: 'logout'})
    }
  })
})


router.put('/changePassword', (req, res) => {
  console.log(req.body)
  let email = req.body.email
  User.findOne({email: email}, (err, user) => {
    if (err) {
      console.log(err);
    } if (user) {
      let pseudo = user.pseudo
      let newPass = Math.random().toString(36).slice(-8)
      // console.log(newPass)
      Bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          console.log(err);
        } else {
          Bcrypt.hash(newPass, salt, (err, hash) => {
            if (err) {
              console.log(err);
            } else {
              newPassHash = hash
              User.update({email: email}, {$set : {password: newPassHash}}, (err, userEmail) => {
                if (err) {
                  console.log(err);
                } if (userEmail) {
                  // console.log(userEmail)
                  let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    secure: false,
                    port: 25,
                    auth: {
                      user: 'glaizet@gmail.com',
                      pass: 'Lolo24041989'
                    },
                    tls: {
                      rejectUnauthorized: false
                    }
                  })

                  let mailOptions = {
                    from:'"mrs mail center" <glaizet@gmail.com>',
                    to: email,
                    subject: 'nouveau mot de passe !',
                    text: 'Hello Wolrd',
                    html: `<p>Salut ${pseudo}</p><p>voici tes nouveaux identifiant:<p><ul><li>pseudo: ${pseudo}</li><li>mot de passe: ${newPass}</li><ul></p><p>clique sur le lien suivant pour t'authentifier: <a href="http://localhost:4200/login">lien</a></p>`
                  }

                  transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                      return console.log(err)
                    }
                    console.log('Message sent: %s', info.messageId)
                    console.log('preview URL: %s',nodemailer.getTestMessageUrl(info))
                  })
                  res.status(200).send('email envoyé')
                } else if (!userEmail) {
                  res.status(404).send('email not changed')
                }
              })
            }
          })
        }
      })
    } else if (!user) {
      res.status(404).send('no user found')
    }
  })
})


// -------------------------------------------------------------------- User ----------------------------------------------------------


router.put('/user/:id', (req, res) => {
  let userData = req.body
  // console.log('id  '  + req.body._id)
  User.findByIdAndUpdate(userData._id, userData, {new: true}, (err, user) => {
    console.log(user)
    if (err) {
      console.log(err);
    } if (user) {
      console.log('ok change saved')
      res.status(200).json(user)
    } else {
      res.status(401).send('no User found')
    }
  })
})


router.get('/user/me', verifyToken, (req, res) => {
  let token = req.headers.authorization.split(' ')[1]
  console.log('token : ' + token)
  let payload = jwt.verify(token, 'secretKey')
  console.log(payload.subject)
  console.log('userMe')
  User.findOne({_id: payload.subject}, (err, user) => {
    if (err) {
      console.log(err)
    } if (user) {
      console.log(user)
      res.status(200).json(user)
    } if (!user) {
      console.log('noUser')
      res.status(401).send('no user found')
    }
  })

})

router.get('/user/:id', verifyToken, (req, res) => {
  // console.log('req.params  '  + JSON.stringify(req.params))
  // console.log(res)
  let userData = req.params
  // console.log(userData.id);
  User.findOne({_id: userData.id}, (err, data) => {
    if (err) {
      // console.log(err)
    } if (data) {
      if (data.deleted && data.deleted === true) {
        res.status(401).send('deleted')
      } else {
        res.status(200).send(data)
      }
    } else {
      res.status(401).send('no User found  '  + data)
    }
  })
})


router.get('/users/:ids', verifyToken, (req, res) => {
  // console.log('ids   '   + typeof req.params.ids)

  User.find({ $and : [{_id: { $in: req.params.ids}}, {deleted : { $ne : true}}]}, (err,users) => {
    if (err) {
      console.log(err);
    } if (users) {
      res.status(200).json(users)
    } else if (!users) {
      res.status(403).send('no user found')
    }
  })
})

router.get('/allusers', verifyToken, (req, res) => {
  User.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } if (data) {
      res.status(200).json(data)
    }
  })
})

router.put('/user/delete/:id', verifyToken, (req,res) => {
  User.findByIdAndUpdate(req.params.id, { $set : { deleted : true}}, {new: true}, (err, user) => {
    if (err) {
      console.log(err)
    } if (user) {
      res.status(200).json(user)
    }
  })
})

// -------------------------------------------------------------------- friendship -----------------------------------------------------


router.get('/friends/:id', (req, res) => {
  // console.log('from friends fetch ' + req.params.id)
  User.findOne({_id: req.params.id}, (err, user) => {
    if (err) {
      console.log(err);
    } if (user) {
      // console.log('friends    :  ' + user.friends);
      let confirmedFriend = []
      user.friends.forEach((friend) => {
        console.log(friend.id)
        if (friend.status == 'confirmed') {
          let id = friend.id
        // console.log('friend ' + typeof friend.id);
          confirmedFriend.push(friend.id)
        }
      })
      // console.log('confirmedFriend ' + JSON.stringify(confirmedFriend))
      User.find({$and : [{_id: {$in: confirmedFriend}}, {deleted : { $ne : true}}]}, (err, friends) => {
        if (err) {
          console.log(err);
        } if (friends) {
          res.status(200).json(friends)
        }
      })
    } if (!user) {
      res.status(401).send('no user found')
    }
  })
})

router.get('/friend/pending/:id', verifyToken, (req, res) => {
  User.findOne({_id: req.params.id}, (err, user) => {
    if (err) {
      console.log(err);
    } if (user) {
      // console.log('friends    :  ' + user.friends);
      let confirmedFriend = []
      user.friends.forEach((friend) => {
        console.log(friend.id)
        if (friend.status == 'invitation recue') {
          let id = friend.id
        // console.log('friend ' + typeof friend.id);
          confirmedFriend.push(friend.id)
        }
      })
      // console.log('confirmedFriend ' + JSON.stringify(confirmedFriend))
      User.find({$and : [{_id: {$in: confirmedFriend}}, {deleted : { $ne : true}}]}, (err, friends) => {
        if (err) {
          console.log(err);
        } if (friends) {
          res.status(200).json(friends)
        }
      })
    } if (!user) {
      res.status(401).send('no user found')
    }
  })
})

router.put('/friend/invite', verifyToken, (req, res) => {
  console.log(req.body)
  let asking = req.body.asking
  let receiving = req.body.receiving

  User.findByIdAndUpdate(receiving.id, {$push : { friends : { id: asking.id, status: asking.status}}}, {new: true}, (err, userReceiving) => {
    if (err) {
      console.log(err);
    } if (userReceiving) {
      User.findByIdAndUpdate(asking.id, {$push : { friends : { id: receiving.id, status: receiving.status}}}, {new:true}, (err, userAsking) => {
        if (err) {
          console.log(err);
        } if (userAsking) {
          let data = {userAsking, userReceiving}
          res.status(200).json(data)
        }
      })
    } if (!userReceiving) {
      res.status(401).send('no receivingUser found')
    }
  })
})


router.put('/friend/accept', verifyToken, (req, res) => {
  console.log(req.body);
  console.log(req.body.userId1)
  User.findOneAndUpdate({_id: req.body.userId1, 'friends._id': req.body.userId2}, {$set: {'friends.$.status' : 'confirmé'}}, {new: true},  (err, userId1) => {
    if (err) {
      console.log(err);
    } if (userId1) {
      console.log(userId1);
      console.log(req.body.userId2);
      User.findOneAndUpdate({_id: req.body.userId2, 'friends._id': req.body.userId1}, {$set: {'friends.$.status' : 'confirmé'}}, {new: true},  (err, userId2) => {
        if (err) {
          console.log(err);
        } if (userId2) {
          let data = {userId1, userId2}
          res.status(200).json(data)
        } if (!userId2) {
          User.findOneAndUpdate({_id: req.body.userId2}, {$push: {'friends': { _id: userId1._id, email: userId1.email, status: 'confirmé'}}}, (err, user2) => {
            if (err) {
              console.log(err);
            } if (user2) {
              let data = {userId1, user2}
              res.status(200).json(data)
            } else if (!user2) {
              res.status(401).send('no user finds')
            }
          })
        }
      })
    } if (!userId1) {
      console.log('user1');
      res.status(401).send('no user finds')
    }
  })
})




router.put('/friend/decline', verifyToken, (req, res) => {
  User.findByIdAndUpdate(req.body.userId1, { "$pull": {"friends" : {"_id" : req.body.userId2}}}, {new: true}, (err, userId1) => {
    if (err) {
      console.log(err);
    } if (userId1) {
      User.findByIdAndUpdate(req.body.userId2, {"$pull": { "friends" : {"_id" : req.body.userId1}}}, {new: true},  (err, userId2) => {
        if (err) {
          console.log(err);
        } if (userId2) {
          let data = {userId1, userId2}
          res.status(200).json(data)
        } if (!userId2) {
          res.status(401).send('no user found')
        }
      })
    } if (!userId1) {
      res.status(401).send('no user found')
    }
  })
})

router.get('/friend/suggestion/:id', verifyToken, (req, res) => {
  User.findOne({_id: req.params.id}, (err, user) => {
    if (err) {
      console.log(err);
    } if (user) {
      let suggester = []
      let suggestedFriend = []
      user.friends.forEach((friend) => {
        if (friend.status == 'recommandé') {
          suggester.push({suggester: friend.suggester, _id: friend._id})
          suggestedFriend.push(friend._id)
        }
      })
      User.find({_id: {$in: suggestedFriend}}, (err, friends) => {
        if (err) {
          console.log(err);
        } if (friends) {
          let data = {friends, suggester}
          res.status(200).json(data)
        }
      })
    } if (!user) {
      res.status(200).json(data)
    }
  })
})

router.put('/friend/friendsuggestion', verifyToken, (req, res) => {
  let suggester = req.body.suggester
  let receiver = req.body.receiver
  let suggestionFriend = req.body.suggestionFriend

  User.findByIdAndUpdate(receiver._id, { $push: {"friends" : { _id: suggestionFriend._id, email: suggestionFriend.email, pseudo: suggestionFriend.pseudo, status: 'recommandé', suggester: suggester._id}}}, {new: true}, (err, user) => {
    if (err) {
      console.log(err);
    } if (user) {

      let email = user.email
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
          user: 'glaizet@gmail.com',
          pass: 'Lolo24041989'
        },
        tls: {
          rejectUnauthorized: false
        }
      })

      let mailOptions = {
        from:'"mrs mail center" <glaizet@gmail.com>',
        to: email,
        subject: 'Tu as recu une nouvelle suggestion d\'ami!',
        text: 'Hello Wolrd',
        html: `<p>Salut ${user.pseudo}</p><p>Tu as recu une suggestion d'ami de la part de ${suggester.pseudo}</p><p>Va vite voir dans tes demandes d'amis reçues</p>`
      }

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          return console.log(err)
        }
        console.log('Message sent: %s', info.messageId)
        console.log('preview URL: %s',nodemailer.getTestMessageUrl(info))
      })
      res.status(200).json(user)
    }
  })
})

// --------------------------------------------------------------- Posts --------------------------------------------------

router.get('/post/fetch/:id/:ids', (req, res) => {
  let id = req.params.id
  console.log(req.params.ids)
  let friends = req.params.ids
  console.log(friends.length)
  // friends.forEach((friend) => {
  //   ids.push(friends)
  // })
  Post.find({ $or : [{creatorId: id}, {creatorId: friends}]}, (err,posts) => {
    if (err) {
      return console.log(err)
    }
    console.log(posts)
    res.status(200).json(posts)
  })
})

router.post('/post/create', (req, res) => {
  let post = req.body
  Post.create(post, (err, post) => {
    if (err) {
      return console.log(err)
    }
    if (post) {
      res.status(200).send(post)
    }
  })
})

router.post('/post/comment/create', (req, res) => {
  let post = req.body
  console.log(post.idEvent)
  console.log(post.id)
  console.log(post.comment)
  Post.findByIdAndUpdate(post.idEvent, { $push : { "comments": {"id": post.id, "comment": post.comment, "avatar": post.avatar, "pseudo": post.pseudo, "date" : new Date()}}}, {new: true}, (err, event) =>  {
    if (err) {
      return console.log(err)
    }
    if (event) {
      console.log(event)
      res.status(200).json(event)
    }
  })
})

// -------------------------------------------------------------------- Events ----------------------------------------------------------


router.get('/events/:id', verifyToken, (req, res) => {
  userId = req.params.id
  Event.find({$and : [{'eventReceiver._id': userId}, {deleted : {$ne : true}}]}, (err, events) => {
    if (err) {
      console.log(err);
    } if (events) {
      res.status(200).json(events)
    } else if (!event) {
      res.status(401).send('No event from user found')
    }
  })
})

router.get('/events/favorite/:id', (req, res) => {
  let userId = req.params.id

  Event.find({$or : [{'participantUsers._id' : userId}, {'interestedUsers._id': userId}]}, (err, events) => {
    if (err) {
      return console.log(err)
    }
    if (events) {
      console.log(events)
      res.status(200).json(events)
    } else if (!events) {
      res.status(401).send('No event')
    }
  })
})


router.get('/event/fetch/:id', (req, res) => {
  let id = req.params.id
  console.log(id)
  Event.find({idEvent: id}, (err, event) => {
    if (err) {
      return err
    }
    if (event.length > 0) {
      res.status(200).json(event)
    }
    else {
      console.log('not found')
      res.status(403).send('No Event found')
    }
  })
})

router.post('/event/post', verifyToken, (req, res) => {
  // console.log('response :  '  + JSON.stringify(req.body))
  let event = req.body
  Event.create(event, (err, event) => {
    if (err) {
      console.log(err);
      // res.status(500).send('an arror occured')
    } if (event) {
      // console.log(res)
      res.status(200).json(event)
    }
      // console.log('result after post  :   '  + res)
  })
})

router.put('/event/post/comment', verifyToken, (req, res) => {
  Event.findByIdAndUpdate(req.body.event, { $push : {"comments" : {"_id": req.body.user._id, "pseudo": req.body.user.pseudo, "text":req.body.user.text, "date": new Date()}}}, {new: true}, (err, event) => {
    if (err) {
      console.log(err)
    } if (event) {
      res.status(200).json(event)
    } else if(!event) {
      res.status(403).send('no event found')
    }
  })
})


router.put('/event/delete/:id', verifyToken, (req, res) => {
  Event.findByIdAndUpdate(req.params.id, { $set: { 'deleted': true}}, {new: true}, (err, event) => {
    if (err) {
      console.log(err)
    } if (event) {
      console.log('event  '  + event)
      res.status(200).json(event)
    }
  })
})


router.get('/allevents', verifyToken, (req, res) => {
  Event.find({}, (err, event) => {
    if (err) {
      console.log(err)
    } if(event) {
      res.status(200).json(event)
    }
  })
})


router.post('/event/follow', (req, res) => {
  let event = req.body
  console.log(req.body)
  // console.log(event.id)
  // console.log(event.interestedUsers)
  Event.findOneAndUpdate({idEvent: event.idEvent}, {$set: {interestedUsers: event.interestedUsers}}, {new: true}, (err, event) => {
    if (err) {
      return console.log(err)
    }
    console.log(event)
    res.status(200).json(event)
  })
})

router.post('/event/unfollow', (req, res) => {
  let event = req.body
  console.log(req.body)
  Event.findOneAndUpdate({idEvent: event.idEvent}, {$set: {interestedUsers: event.interestedUsers}}, {new: true}, (err, event) => {
    if (err) {
      return console.log(err)
    }
    res.status(200).json(event)
  })
})

router.post('/event/participate', (req, res) => {
  let event = req.body
  console.log();
  Event.findOneAndUpdate({idEvent: event.idEvent}, {$set: {participantUsers: event.participantUsers}}, {new: true}, (err, event) => {
    if (err) {
      return console.log(err)
    }
    console.log(event)
    res.status(200).json(event)
  })
})

router.post('/event/unparticipate', (req, res) => {
  let event = req.body
  Event.findOneAndUpdate({idEvent: event.idEvent}, {$set: {participantUsers: event.participantUsers}}, {new: true}, (err, event) => {
    if (err) {
      return console.log(err)
    }
    console.log(event)
    res.status(200).json(event)
  })
})

router.post('/event/create', (req, res) => {
  let event = req.body
  console.log(req.body)
  Event.create(event, (err, event) => {
    if (err) {
      return console.log(err)
    }
    res.status(200).json(event)
  })
})


// -------------------------------------------------------------------- Discussions -----------------------------------------------------


router.get('/discussions/:id', verifyToken, (req, res) => {
  console.log(req.params.id)
  let id = req.params.id
  Disc.find({$or: [{"eventCreator._id": id},{"participants._id": req.params.id}]}, (err, discussions) => {
    if (err) {
      console.log(err)
    } if (discussions) {
      res.status(200).json(discussions)
    } if (!discussions) {
      res.status(403).send('no discussion found')
    }
  })
})

router.get('/discussion/:id', verifyToken, (req, res) => {
  let id = req.params.id
  Disc.findOne({_id: id}, (err, disc) => {
    if (err) {
      console.log(err)
    } if (disc) {
      res.status(200).json(disc)
    }
  })
})

router.post('/discussion/post', verifyToken, (req, res) => {
  Disc.create(req.body, (err, disc) => {
    if (err) {
      console.log(err);
    } if (disc) {
      res.status(200).json(disc)
    }
  })
})

router.put('/discussion/delete', verifyToken, (req, res) => {
  Disc.findByIdAndUpdate(req.params.id, {$set : {'deleted': true}}, {new: true}, (err, res) => {
    if (err) {
      console.log(err);
    } if (res) {
      res.status(200).send('discussion deleted')
    }
  })
})

router.put('/discussion/comment/post', verifyToken, (req, res) => {
  console.log(req.body);
  Disc.findByIdAndUpdate(req.body.discussion, { $push :{ comments : { _id: req.body.me._id, pseudo: req.body.me.pseudo, text: req.body.text, date: new Date()}}}, {new: true}, (err, disc) => {
    if (err) {
      console.log(err)
    } if (disc) {
      res.status(200).send(disc)
    }
  })
})


router.get('/discussions', verifyToken, (req, res) => {
  Disc.find({}, (err, disc) => {
    if (err) {
      console.log(err)
    } if (disc) {
      res.status(200).json(disc)
    }
  })
})


// ---------------------------------------------------- spotify -------------------------------------------------------------



                // ------------------------------------- Auth --------------------------------------------



var client_id = '9f854027e27f459bbe6fa01599ff86f7';
var client_secret = '9d14626ea88d4f46a8d858fd4a957efe';
var redirect_uri = 'http://fanzik.org/home';

router.use(cors())
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';
var state = generateRandomString(16);

router.use((req, res, next) => {
  let cookie = req.cookies['spotify_auth_state']

  if (!cookie) {
    res.cookie(stateKey, state)
    req.cookies['spotify_auth_state'] = state
  }
  next();
});


router.get('/spotify/login',  function(req, res) {
  console.log('enter setting cookie')
  console.log(req.cookies)
  // res.header['set-cookie'] = state
  // console.log('cookie ' + res.header['set-cookie'])
  // res.cookie(stateKey, state, { expires  : new Date(Date.now() + 9999999), domain: 'http://localhost:8080', httpOnly: false });
  // console.log(res.cookie(stateKey))

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-follow-read user-top-read';
  let url = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
      show_dialog: true
    })
  // res.redirect('https://accounts.spotify.com/authorize?' +
  //   querystring.stringify({
  //     response_type: 'code',
  //     client_id: client_id,
  //     scope: scope,
  //     redirect_uri: redirect_uri,
  //     state: state
  //   }));
    res.send({url: url, cookie: state})
});

router.get('/callback', function(req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  console.log('entering callback')
  console.log(req.cookies)
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    console.log('clear cookie')
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      let data = {}
      if (!error && response.statusCode === 200) {
        console.log(body.access_token)
        let access_token = body.access_token,
            refresh_token = body.refresh_token;

        console.log('Access_TOken ' + access_token)

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          data = body
          let url = 'www.fanzik.org/home/5c0516cd7932d70016795f87?auth=accept'
          // let url = 'http://localhost:8080/home?' +
          //   querystring.stringify({
          //     access_token: access_token,
          //     refresh_token: refresh_token
          //   })
          res.send({url:url, access_token: access_token, refresh_token: refresh_token, data: data})
        });

        // we can also pass the token to the browser to make requests from there
        // res.redirect('/#' +
        //   querystring.stringify({
        //     access_token: access_token,
        //     refresh_token: refresh_token
        //   }));

      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});


router.post('/user/tokens/:access_token/:refresh_token', (req, res) => {
  // console.log('token for save ' + JSON.stringify(JSON.parse(req.params.tokens)))
  // console.log(typeof req.params.tokens)
  console.log('req.body ' + req.body.avatar)
  let access_token = req.params.access_token
  let refresh_token = req.params.refresh_token
  let avatar = req.body.avatar
  let id = req.headers.authorization.split(' ')[1]
  let payload = jwt.verify(id, 'secretKey')

  User.findOneAndUpdate({_id: payload.subject},{$set : {access_token: access_token, access_token_validate_time: Date.now(), refresh_token: refresh_token, avatar: avatar }}, {new: true}, (err, data) => {
    if (err) {
      return console.log(err)
    }
    console.log('data from save token ' + data)
    res.status(200).send('Access_token and refresh_token saved')
  })
})

router.post('/user/newtoken/:token', (req, res) => {
  let access_token = req.params.token
  let id = req.headers.authorization.split(' ')[1]
  let payload = jwt.verify(id, 'secretKey')

  User.findOneAndUpdate({_id: payload.subject}, {$set : {access_token: access_token, access_token_validate_time: Date.now()}}, {new: true}, (err, data) => {
    res.status(200).send(data)
  })
})


router.get('/user/access_token/isvalidate', (req, res) => {
  let id = req.headers.authorization.split(' ')[1]
  let payload = jwt.verify(id, 'secretKey')
  User.findOne({_id: payload.subject}, {"access_token_validate_time": 1}, (err, data) => {
    if (err) {
      return console.log(err)
    }
    console.log(data)
  })
})

router.get('/refresh_token/:token', function(req, res) {
  var refresh_token = req.params.token;
  console.log('refresh'  + refresh_token)
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      console.log('send new access_token')
      res.send({
        'access_token': access_token
      });
    } else {
      console.log(response)
    }
  });
});

                // ------------------------------------- Data --------------------------------------------

router.get('/user/spotify/me/:token', (req, res) => {
  let access_token = req.params.token

  let options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };

  request.get(options, (error, response, body) => {
    res.send(body)
  })
})


router.get('/user/spotify/playlist/:access_token', (req, res) => {
  let access_token = req.params.access_token
  console.log(access_token)
  let playlists = {}

  let options = {
    url: 'https://api.spotify.com/v1/me/playlists?limit=50',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  }

  request.get(options, (error, response, body) => {
    playlists = body.items
    let playlist = playlists.filter((playlist) => {
      return playlist.name == 'Inox festival'
    })

    playlist = Object.assign({}, playlist)
    console.log('playlist' + playlist)
    options = {
      url: `https://api.spotify.com/v1/playlists/${playlist[0].id}/tracks`,
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    }

    request.get(options, (error, response, body) => {
      let tracks = body.items

      console.log(body.items[0].track.album.artists[0].name)
      body.items.map((item) => {
      })
    })
  })
})


router.get('/user/spotify/artists/:token/:q', (req, res) => {
  let access_token = req.params.token
  let q = req.params.q

  let options = {
    url: `https://api.spotify.com/v1/search?q=${q}&type=artist`,
    headers: { 'Authorization': 'Bearer ' + access_token },
    q: q,
    type: 'artist',
    json: true
  }

  request.get(options, (error, response, body) => {
    res.send(body)
  })
})

router.get('/user/spotify/artist/:token/:q', (req, res) => {
  let access_token = req.params.token
  let q = req.params.q
  console.log('access_token' + access_token)

  let options = {
    url: `https://api.spotify.com/v1/artists/${q}` ,
    headers: { 'Authorization': 'Bearer ' + access_token },
    q: q,
    type: 'artist',
    json: true
  }

  request.get(options, q, (error, response, body) => {
    // console.log(body)
    // console.log('sending Info')
    res.send(body)
  })
})

router.get('/user/spotify/artist/byname/:token/:q', (req, res) => {
  let access_token = req.params.token
  let q = req.params.q
  console.log('access_token' + access_token)

  let options = {
    url: `https://api.spotify.com/v1/search?q=${q}&type=artist` ,
    headers: { 'Authorization': 'Bearer ' + access_token },
    q: q,
    type: 'artist',
    json: true
  }

  request.get(options, q, (error, response, body) => {
    // console.log(body)
    // console.log('sending Info')
    res.send(body)
  })
})


router.get('/spotify/artist/relatedartists/:token/:id', (req, res) => {
  let access_token = req.params.token
  let id = req.params.id

  let options = {
    url: `https://api.spotify.com/v1/artists/${id}/related-artists` ,
    headers: { 'Authorization': 'Bearer ' + access_token },
    id: id,
    type: 'artist',
    json: true
  }

  request.get(options, id, (error, response, body) => {
    // console.log(body)
    res.send(body)
  })
})

router.get('/user/spotify/following/:token', (req, res) => {
  let access_token = req.params.token
  console.log(access_token)

  let options = {
    url:  'https://api.spotify.com/v1/me/following?type=artist&limit=50',
    headers: { 'Authorization' : 'Bearer ' + access_token},
    json: true
  }

  request.get(options, (error, response, body) => {
    console.log(body)
    res.send(body)
  })
})

router.get('/user/spotify/top/:token', (req, res) => {
  // console.log(req.params.token)
  let access_token = req.params.token

  let options = {
    url: `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term`,
    headers: { 'Authorization' : 'Bearer ' + access_token },
    json: true
  }

  request.get(options, (error, response, body) => {
    res.send(body)
  })
})





// ---------------------------------------------------- EventFul -----------------------------------------------------------

function convert_accented_characters(str){
    var conversions = new Object();
    conversions[' '] = '[_]';
    conversions[''] = '^[_]'
    conversions['ae'] = 'ä|æ|ǽ';
    conversions['oe'] = 'ö|œ';
    conversions['ue'] = 'ü';
    conversions['Ae'] = 'Ä';
    conversions['Ue'] = 'Ü';
    conversions['Oe'] = 'Ö';
    conversions['A'] = 'À|Á|Â|Ã|Ä|Å|Ǻ|Ā|Ă|Ą|Ǎ';
    conversions['a'] = 'à|á|â|ã|å|ǻ|ā|ă|ą|ǎ|ª';
    conversions['C'] = 'Ç|Ć|Ĉ|Ċ|Č';
    conversions['c'] = 'ç|ć|ĉ|ċ|č';
    conversions['D'] = 'Ð|Ď|Đ';
    conversions['d'] = 'ð|ď|đ';
    conversions['E'] = 'È|É|Ê|Ë|Ē|Ĕ|Ė|Ę|Ě';
    conversions['e'] = 'è|é|ê|ë|ē|ĕ|ė|ę|ě';
    conversions['G'] = 'Ĝ|Ğ|Ġ|Ģ';
    conversions['g'] = 'ĝ|ğ|ġ|ģ';
    conversions['H'] = 'Ĥ|Ħ';
    conversions['h'] = 'ĥ|ħ';
    conversions['I'] = 'Ì|Í|Î|Ï|Ĩ|Ī|Ĭ|Ǐ|Į|İ';
    conversions['i'] = 'ì|í|î|ï|ĩ|ī|ĭ|ǐ|į|ı';
    conversions['J'] = 'Ĵ';
    conversions['j'] = 'ĵ';
    conversions['K'] = 'Ķ';
    conversions['k'] = 'ķ';
    conversions['L'] = 'Ĺ|Ļ|Ľ|Ŀ|Ł';
    conversions['l'] = 'ĺ|ļ|ľ|ŀ|ł';
    conversions['N'] = 'Ñ|Ń|Ņ|Ň';
    conversions['n'] = 'ñ|ń|ņ|ň|ŉ';
    conversions['O'] = 'Ò|Ó|Ô|Õ|Ō|Ŏ|Ǒ|Ő|Ơ|Ø|Ǿ';
    conversions['o'] = 'ò|ó|ô|õ|ō|ŏ|ǒ|ő|ơ|ø|ǿ|º';
    conversions['R'] = 'Ŕ|Ŗ|Ř';
    conversions['r'] = 'ŕ|ŗ|ř';
    conversions['S'] = 'Ś|Ŝ|Ş|Š';
    conversions['s'] = 'ś|ŝ|ş|š|ſ';
    conversions['T'] = 'Ţ|Ť|Ŧ';
    conversions['t'] = 'ţ|ť|ŧ';
    conversions['U'] = 'Ù|Ú|Û|Ũ|Ū|Ŭ|Ů|Ű|Ų|Ư|Ǔ|Ǖ|Ǘ|Ǚ|Ǜ';
    conversions['u'] = 'ù|ú|û|ũ|ū|ŭ|ů|ű|ų|ư|ǔ|ǖ|ǘ|ǚ|ǜ';
    conversions['Y'] = 'Ý|Ÿ|Ŷ';
    conversions['y'] = 'ý|ÿ|ŷ';
    conversions['W'] = 'Ŵ';
    conversions['w'] = 'ŵ';
    conversions['Z'] = 'Ź|Ż|Ž';
    conversions['z'] = 'ź|ż|ž';
    conversions['AE'] = 'Æ|Ǽ';
    conversions['ss'] = 'ß';
    conversions['IJ'] = 'Ĳ';
    conversions['ij'] = 'ĳ';
    conversions['OE'] = 'Œ';
    conversions['f'] = 'ƒ';

    for(var i in conversions){
    var re = new RegExp(conversions[i],"g");
    if (i <= 2) {
    }
    str = str.replace(re,i);
}

return str;
}

// router.get('/user/eventful/search/:d', (req, res) => {
//   let d = req.params.q
//
//   let options = {
//     url: `http://eventful.com/rest/events?q=${d}`,
//     headers: { 'Authorization': 'Bearer KNTLkbbm3QH6vhQf' },
//     json: true
//   }
//
//   request.get(options, (error, response, body) => {
//     console.log(body)
//   })
// })

router.get('/user/eventful/:q', (req, res) => {
  let q = req.params.q.split(',')
  let p = []
  q.forEach((result) => {
    result = convert_accented_characters(result)
    p.push(result)
  })
  let events = []
  let count = 0
  p.forEach((artist) => {
    console.log(artist)
    new Promise ((resolve, reject) => {
      client.searchEvents({keywords: artist, perfomers: artist ,location: 'France', page_size: 20, category: 'music'}, (err, data) => {
        if (err) {
          return console.log(err);
        }
        count++
        if (data.search.events.event) {
          if (data.search.events.event.length > 0) {
            data.search.events.event = data.search.events.event.filter((event) => {
              return event.title.toLowerCase().includes(artist.toLowerCase())
            })
            if (data.search.events.event.length > 0) {
              events.push(data)
            }
          } else {
            // console.log('only one event')
            if (data.search.events.event.title.toLowerCase().includes(artist.toLowerCase())) {
              events.push(data)
            }
          }
        }
          if (count === q.length) {
            resolve(events)
          }
      })
    }).then((data) => {
      res.send({data})
    })
  })
})

router.get('/artist/eventful/:q', (req, res) => {
  let artist = req.params.q
  console.log(artist)

  client.searchEvents({keywords: artist, witihin: 'title', page_size: 20, category: 'music'}, (err, data) => {
    if (err) {
      return console.log(err);
    }
    res.send({data})
  })
})


router.get('/eventful/searchall', (req, res) => {
  client.searchEvents({location: 'France', page_size: 50, category: 'music'}, (err, data) => {
    if (err) {
      return console.log(err)
    }
    res.send({data})
  })
})

router.get('/event/eventful/:artist/:id', (req, res) => {
  let artist = req.params.artist
  let id = req.params.id
  console.log(id)
  // client.listCategories((err, data) => {
  //   console.log(data)
  // })
  client.searchEvents({keywords: artist, page_size: 50}, (err, data) => {
    if (err) {
      return console.log(err)
    }
    console.log(data.search.events.event)
    if (data.search.events.event) {
      data.search.events.event = data.search.events.event.filter((event) => {
        return event.$.id == id
      })
    }
    console.log(data.search.events.event[0])
    res.send({data})
  })
})


module.exports = router
