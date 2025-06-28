const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return v.length > 3
            },
            message: props => `${props.value} is not a valid name`
        }
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.length > 8
            },
            message: props => `${props.value} is not a valid number`
        }
    },
})

module.exports = mongoose.model('Person', personSchema)
