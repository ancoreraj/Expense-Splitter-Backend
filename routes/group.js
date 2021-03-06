const express = require('express');
const router = express.Router();
const Group = require('./../models/Group')
// Welcome Page

//To create a new group
//@POST => /group/new-group
router.post('/new-group', (req, res) => {
    const { people, name } = req.body

    const newGroup = new Group({
        name,
        people
    })

    newGroup.save((err) => {
        if (err) {
            return res.status(400).json({ message: 'Internal server error', err })
        }
        res.status(200).json({ message: 'New Group Created Successfully', newGroup })
    })

});


//To Get all the groups
//@GET => /group/
router.get('/', async (req, res) => {
    try {
        const allGroups = await Group.find({})

        res.status(200).json(allGroups)

    } catch (err) {
        return res.status(400).json({ message: 'Internal server error', err })
    }

});

//To Get all the groups
//@GET => /group/
router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params
        const allGroups = await Group.findById(id)

        res.status(200).json(allGroups)

    } catch (err) {
        return res.status(400).json({ message: 'Internal server error', err })
    }

});

module.exports = router
