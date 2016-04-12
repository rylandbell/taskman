var mongoose = require('mongoose')

//define schema for mongoDB documents
var taskSchema = new mongoose.Schema({
	taskName: {type: String, required: true},
	flagged: {type: Boolean, "default": false},
	details: {type: String, required: false},
	dateAdded: Date,
	dateDue: Date
});

//connect this schema to the database. automatically creates a MongoDB collection 'tasks' based on the supplied parameter 'Task'
mongoose.model('Task', taskSchema);