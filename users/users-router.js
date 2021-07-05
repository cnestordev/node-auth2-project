const express = require('express')
const jwt = require('jsonwebtoken')

const router = express.Router()

const db = require('../data/db-config')
const { hash, compare } = require('../helper/hash')

router.get('/users', verifyToken(), (req, res) => {
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
                const token = generateToken(user)
                res.status(201).json({ message: 'you have been successfully logged in', token: token })
            } else {
                res.status(401).json({ message: 'invalid credentials' })
            }
        })
        .catch(error => {
            res.status(500).json({ message: error.message })
        })
})

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        department: user.department
    }

    const options = {
        expiresIn: '1d'
    }

    return jwt.sign(payload, process.env.JWT_SECRET || "secret", options)
}

function verifyToken(req, res, next) {

    return function (req, res, next) {
        console.log(0)
        const token = req.headers.authorization
        const secret = process.env.JWT_SECRET || "secret"

        if (token) {
            jwt.verify(token, secret, (err, decodedToken) => {
                if (!err) {
                    console.log(1)
                    req.jwt = decodedToken
                    next()
                } else {
                    console.log(2)

                    res.status(403).json({ message: 'Not Authorized' })
                }
            })
        } else {
            res.status(403).json({ message: 'Not Authorized' })
        }
    }
}

module.exports = router