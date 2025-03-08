const { ensureAuthenticated } = require('../middlewares/Authenticate');

const router = require('express').Router();

router.get('/',ensureAuthenticated,(req,res) => {
    res.status(200).json(
        {
            success: true,
            data:[
            {name: "Mobile",price: 10000},
            {name: "Watch",price: 6000}]
        }
    )
})

module.exports = router;