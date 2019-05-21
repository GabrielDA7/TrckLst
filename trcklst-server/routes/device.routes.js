const { Router } = require('express');
const deviceController = require('../controllers/device.controller');

const router = Router();

router.route('/')
    /** GET /api/devices - Get spotify user devices  */
    .get(deviceController.get);

module.exports = router;