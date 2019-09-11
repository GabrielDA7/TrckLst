const { Router } = require('express');
const roomController = require('../controllers/room.controller');

const router = Router(); // eslint-disable-line new-cap

router.route('/')
  /** POST /api/rooms - Create new room */
  .post(roomController.create);

router.route('/:room_id')
  /** GET /api/rooms/:room_id - Get room */
  .get(roomController.get);

router.route('/:room_id/play')
  /** GET /api/rooms/:room_id/play - Play room playlist */
  .get(roomController.play);

router.route('/:room_id/pause')
  /** GET /api/rooms/:room_id/pause - Pause room playlist */
  .get(roomController.pause);

/** Load room when API with roomId route parameter is hit */
router.param('room_id', roomController.load);

module.exports = router;
