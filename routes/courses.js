const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
    res.send([1, 2, 3, 4]);
});

router.get('/:id', (req, res) => {
    res.send(req.params.id);
    //req.query returns object of the query parameters
});

module.exports = router;