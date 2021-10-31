const express = require('express');
const router = express.Router();
const Group = require('./../models/Group')
const Transaction = require('./../models/Transaction')
const sendEmail = require('./../controllers/emailNotification/email')

//To create a new transaction of a given groupID
//@POST => /transaction/new-transaction
router.post('/new-transaction', async (req, res) => {
    try {
        let { title, groupId, category, whoPaid, price, splitEqual, split } = req.body

        //we have to create 
        //1. split
        //2. individual balance
        //3. howToSettle

        let allPeople = await Group.findById(groupId)
        console.log(allPeople)
        let noOfPeople = allPeople.people.length
        console.log(noOfPeople)
        let individualBalance = []
        let howToSettle = []


        if (splitEqual) {

            let percentageShareEach = 100 / noOfPeople
            let pricePayEach = price / noOfPeople
            split = [];

            allPeople.people.forEach((p) => {

                //calculating split
                split.push({ name: p.name, percentageShare: percentageShareEach })


                //calculating individualBalance
                let balanceWhoPaid = (price - pricePayEach)
                let balanceAllOther = (-1) * pricePayEach

                if (p.name === whoPaid) {
                    individualBalance.push({ name: p.name, balance: balanceWhoPaid })
                } else {
                    individualBalance.push({ name: p.name, balance: balanceAllOther })
                }


                //calculating howToSettle
                if (p.name != whoPaid) {
                    howToSettle.push({ how: `${p.name} owes ${whoPaid} Rs. ${Math.floor(pricePayEach)}`, name1: p.name, name2: whoPaid, money: Math.floor(pricePayEach)})

                    //Send Email notification
                    sendEmail(p.email, `You owes ${whoPaid} Rs. ${Math.floor(pricePayEach)}`)
                }
            })

        } else {
            //here we already know the split

            split.forEach((p) => {

                let costByPercentageOfP = (p.percentageShare / 100) * price

                //calculating individualBalance
                if (p.name != whoPaid) {
                    let balanceOfP = (-1) * costByPercentageOfP
                    individualBalance.push({ name: p.name, balance: balanceOfP })

                } else {
                    let balanceOfP = costByPercentageOfP
                    balanceOfP = price - balanceOfP
                    individualBalance.push({ name: p.name, balance: balanceOfP })
                }

                //calculating howToSettle
                if (p.name != whoPaid) {
                    howToSettle.push({ how: `${p.name} owes ${whoPaid} Rs. ${Math.floor(costByPercentageOfP)}`, name1: p.name, name2: whoPaid, money: Math.floor(costByPercentageOfP) })

                    allPeople.people.forEach((pop) => {
                        if (pop.name == p.name) {
                            sendEmail(pop.email, `You owes ${whoPaid} Rs. ${Math.floor(costByPercentageOfP)}`)

                        }
                    })
                }

            })
        }

        console.log(individualBalance)
        console.log(howToSettle)

        const newTransaction = new Transaction({
            title,
            groupId,
            category,
            whoPaid,
            price,
            splitEqual,
            split,
            individualBalance,
            howToSettle
        })

        newTransaction.save((err) => {
            if (err) {
                console.log(err)
                return res.status(400).json({ message: 'Internal server error' })
            }
            res.status(200).json({ message: 'New Transaction Created Successfully', newTransaction })
        })

    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Internal server error' })

    }

});


//To get all the transaction
//@GET => /transaction
router.get('/', async (req, res) => {
    try {
        const allTransaction = await Transaction.find({})

        res.status(200).json(allTransaction)

    } catch (err) {
        return res.status(400).json({ message: 'Internal server error' })
    }

});

//To get a transaction of given id
//@GET => /transaction/id/:id
router.get('/id/:id', async (req, res) => {
    try {
        const { id } = req.params
        const allTransaction = await Transaction.findById(id)

        res.status(200).json(allTransaction)

    } catch (err) {
        return res.status(400).json({ message: 'Internal server error' })
    }

});




//To get all the transaction of a given groupId
//@GET => /transaction/:groupId
router.get('/:groupId', async (req, res) => {
    try {
        const { groupId } = req.params
        const allTransaction = await Transaction.find({ groupId })
        res.status(200).json(allTransaction)

    } catch (err) {
        return res.status(400).json({ message: 'Internal server error' })
    }

});

//To get all the transaction of a given category
//@GET => /transaction/category/:category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params
        const allTransaction = await Transaction.find({ category })
        res.status(200).json(allTransaction)

    } catch (err) {
        return res.status(400).json({ message: 'Internal server error' })
    }

});


router.post('/settle/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { how, name1, name2, money } = req.body
        const findTransaction = Transaction.findById(id)

        if(!findTransaction){
            res.status(400).json({message: 'Data not found'})
        }

        findTransaction.individualBalance.forEach((e)=>{
            if(e.name === name1){
                e.balance = 0
            }

            if(e.name === name2){
                e.balance -= money
            }
        })

        findTransaction.howToSettle.forEach((e)=>{
            if(e.how === how){
                e.how = `Balance settled between ${name1} and ${name2}`
            }
        })

        findTransaction.save((err)=>{
            if(err){
                return res.status(400).json({message: 'Internal Server error'})
            }
            res.status(200).json({message: 'Settled'})
        })

    } catch (err) {
        return res.status(400).json({message: 'Internal Server error'})
    }

})
module.exports = router
