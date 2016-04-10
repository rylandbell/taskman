var priLevels=['Low','Medium','High'] 

var task_data = [
	{name: 'Move data to controller',
	priority: 'High',
	details: 'A consensus of longer-range computer models now show La Niña conditions emerging by around July, and should peak this winter at a moderate intensity. Though this time of year is known for its relatively less reliable forecasts of this sort, virtually every strong El Niño on record has quickly transitioned to at least a weak La Niña, and there’s no reason to believe that this year will be any different. An additional boost of confidence: A few weeks ago, NOAA researchers fixed a bug in one of their flagship long-range models, which had been showing a continuation of El Niño conditions until 2017. Since then, it’s gotten on board with the La Niña forecast, too.'
	},
	{name: 'Take Walk',
	priority: 'Low'},
	{name: 'End world hunger!',
	priority: 'Low',
	details: 'The sooner the better, but no big hurry.'}
	];

for (var i=0; i<task_data.length; i++){
	task_data[i].dateAdded = new Date (2016, 3, i+10);
	task_data[i].dateDue = new Date (2016, 3, i+20);
}

/* GET task list */
module.exports.list = function(req, res, next) {
  res.render('list', { title: 'List View', tasks: task_data });
};
	
/* GET task details */
module.exports.details = function(req, res, next) {
  res.render('details', { title: 'Details View', tasks: task_data, levels: priLevels });
};

var task1 = {
	name: 'Finish static view of app',
	priority: 1,
	details: 'A consensus of longer-range computer models now show La Niña conditions emerging by around July, and should peak this winter at a moderate intensity. Though this time of year is known for its relatively less reliable forecasts of this sort, virtually every strong El Niño on record has quickly transitioned to at least a weak La Niña, and there’s no reason to believe that this year will be any different. An additional boost of confidence: A few weeks ago, NOAA researchers fixed a bug in one of their flagship long-range models, which had been showing a continuation of El Niño conditions until 2017. Since then, it’s gotten on board with the La Niña forecast, too.'
}

task1.dateAdded = new Date (2016,3,3);
task1.dateDue = new Date (2016,3,9);



