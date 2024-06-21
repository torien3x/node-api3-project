const express = require('express');
const {
  validateUserId,
  validateUser,
  validatePost,
} = require('../middleware/middleware');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const User = require('./users-model')
const Post = require('../posts/posts-model')


const router = express.Router();

router.get('/', (req, res) => {
  User.get()
    .then(users => {
      res.json(users)
    })
    .catch(err => console.log(err))
});

router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user)
});

router.post('/', validateUser, (req, res) => {
  User.insert({ name: req.name })
  .then(newUser => {
      res.status(201).json(newUser)
  })
  .catch(err => {
    console.log(err)
  })
});

router.put('/:id', validateUserId, validateUser,(req, res) => {
  User.update(req.params.id, { name: req.name })
    .then(() => {
      return User.getById(req.params.id)
    })
    .then(user => {
      res.json(user)
    })
    .catch(err => console.log(err))
});

router.delete('/:id', validateUserId, async (req, res) => {
  try {
    await User.remove(req.params.id)
    res.json(req.user)
  } catch (err) {
console.log(err)
  }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
 try {
  const results = await User.getUserPosts(req.params.id)
  res.json(results)
 } catch (err) {
console.log(err)
 }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  try {
    const results = await Post.insert({
      user_id: req.params.id,
      text: req.text,
    })
    res.json(results)
  } catch (err) {
console.log(err)
  }
});


// do not forget to export the router
module.exports = router;