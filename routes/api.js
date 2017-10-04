'use strict';
const express = require('express');
const router = express.Router();

router.get('/current_user', (req, res) => {
    const {_id, googleID} = req.user;
    res.send({_id, googleID});
});

router.get('/logout', (req, res) => {
    req.logout();
    const {_id, googleID} = req.user;
    res.send({_id, googleID});
});

module.exports = router;
