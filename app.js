(function(){
	'use strict';

	var myApp = new o.Module('myApp');

	var todoList = [
		{
			id: 1,
			name: 'Watch JS Talks aboud Design Patterns',
			done: false
		},
		{
			id: 2,
			name: 'Create own awesome framework',
			done: false
		},
		{
			id: 3,
			name: 'Study English',
			done: true
		},
	];

	var todoListData = new o.DataModel('todoList', todoList);


})();
