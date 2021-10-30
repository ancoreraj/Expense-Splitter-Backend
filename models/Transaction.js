const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    },
    category: { //food, travel
        type: String

    },
    whoPaid: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    splitEqual: { //if we have to split equally
        type: Boolean,
    },
    split: [{ //if we are splitting with percentage
        name: {
            type: String,
        },
        percentageShare: {
            type: Number,
        }
    }],
    individualBalance: [{
        name: {
            type: String
        },
        balance: {
            type: Number
        }
    }],
    howToSettle: [{
        how: {
            type: String
        }
    }]
    
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;