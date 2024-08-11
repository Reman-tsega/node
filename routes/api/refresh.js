const express = require('express')
const { refreshToken } = require('../../controlers/authControllers')
const router = express.Router()
router.get('/', refreshToken)

module.exports = router;
