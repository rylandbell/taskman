var mongoose = require('mongoose')

//define schema for mongoDB documents
var taskSchema = new mongoose.Schema({
	name: {type: String, required: true},
	completed: {type: Boolean, "default": false, required: true},
	flagged: {type: Boolean, "default": false},
	details: {type: String},
	dateAdded: {type: Date, "default": new Date()},
	dateDue: Date
});

//connect this schema to the database. automatically creates a MongoDB collection 'tasks' based on the supplied parameter 'Task'
mongoose.model('Task', taskSchema);