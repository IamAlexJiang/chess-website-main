const express = require('express');
const router = express.Router();
const getBoards = require('./chess/getBoards');
const saveBoard = require('./chess/saveBoard');
const deleteBoard = require('./chess/deleteBoard');
const analyzeChessMoves = require('./chess/analyze');

// Chess routes
router.get('/chess/getRecord', getBoards);
router.post('/chess/saveRecord', saveBoard);
router.post('/chess/delete', deleteBoard);
router.post('/chess/analyze', analyzeChessMoves);

module.exports = router; 