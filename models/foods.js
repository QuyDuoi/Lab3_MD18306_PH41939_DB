const mongoose = require('mongoose');
const { route } = require('../routes');
const { router } = require('../app');
const Scheme = mongoose.Schema;

const Foods = new Scheme({
    tenMon: {type: String},
    loaiMon: {type: String},
    giaMon: {type: Number},
    trangThai: {type: Number},
    hinhAnh: {type: Array},
    moTa: {type: String},
}, {
    timestamps: true
})

module.exports = mongoose.model('food', Foods);