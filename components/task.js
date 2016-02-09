(function () {
	'use stict';

	o.getModule('myApp')
		.createComponent({
			name: 'task',
			selector: "#app",
			template: templates.task,
			ctrlFunc: ctrlFunc
		})

		.registerComplexRoute('/done/task1')

		.addDataModel(o.getDataModel('todoList'));

		function ctrlFunc(getDataModel){
		var model = getDataModel('todoList');
		console.log(model);
		this.task = model[0];
		}

})();
