const express = require('express')

const router = express.Router()

const db = require('../data/db-config')
const { hash, compare } = require('../helper/hash')

router.get('/users', (req, res) => {
    db('users')
        .then(users => {
            res.status(200).json({ data: users })
        })
        .catch(error => {
            res.status(500).json({ message: 'there was a problem retriving users' })
        })
})


router.post('/register', (req, res) => {
    req.body.password = hash(req.body.password)
    db('users')
        .insert(req.body, "id") //validate req body
        .then(id => {
            res.status(201).json({ message: 'You have successfully added new user' })
        })
        .catch(error => {
            res.status(500).json({ message: 'There was a problem registering user' })
        })
})


router.post('/login', (req, res) => {
    db('users')
        .where('users.username', req.body.username)
        .first()
        .then(user => {
            if (user && compare(req.body.password, user.password)) {
                res.status(201).json({ message: 'you have been successfully logged in' })
            } else {
                res.status(401).json({ message: 'invalid credentials' })
            }
        })
        .catch(error => {
            res.status(500).json({ message: error.message })
        })
})



module.exports = router