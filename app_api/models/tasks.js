var mongoose = require('mongoose')
var taskSchema = new mongoose.Schema({
	taskName: {type: String, required: true},
	flagged: {type: Boolean, "default": false},
	details: {type: String, required: false},
	dateAdded: Date,
	dateDue: Date
});

mongoose.model('Task', taskSchema);