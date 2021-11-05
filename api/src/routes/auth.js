const express = require('express')
const { auth } = require('../middleware/auth')
const User = require('../models/user')
const router = new express.Router()

router.post('/signup', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const accessToken = await user.generateJWT();
        const refreshToken = await user.generateRefreshToken();
        res.send({ user, accessToken, refreshToken });
    } catch (e) {
        res.status(400).send({error: true, message: e.message})
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);

        if (!user)
            return res.status(404).send({ error: true, message: "Wrong username and/or password"});

        const accessToken = await user.generateJWT();
        const refreshToken = await user.generateRefreshToken();
        
        res.send({ user, accessToken, refreshToken });
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) 
        return res.status(400).send({ error: true, message: "Refresh token is required"});

    try {
        const user = await User.findOne({ "refreshToken.token": refreshToken });
        if (!user) 
            return res.status(404).send({ error: true, message: "Refresh token is not associated with any user"});
        if (Date.now() > user.refreshToken.expirationDate)
            return res.status(403).send({ error: true, message: "Refresh token has expired"});

        const newAccessToken = await user.generateJWT();
        const newRefreshToken = await user.generateRefreshToken();
            
        res.send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (e) {
        return res.status(500).send({ error: true, message: e.message });
    }
})

module.exports = router