const { Router } = require('express');
const searchController = require('../controllers/search.controller');
const roomController = require('../controllers/room.controller');

const router = Router();

router.route('/:room_id/:term/:types')
  /** GET /api/search -  Search song */
  .get(searchController.search);


/** Load room when API with roomId route parameter is hit */
router.param('room_id', roomController.load);

module.exports = router;
