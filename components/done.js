(function () {
	'use stict';

	o.getModule('myApp')
		.createComponent({
			name: 'done',
			selector: "#app",
			template: templates.done,
			ctrlFunc: ctrlFunc
		})

		.registerRoute('/done')

		.addDataModel(o.getDataModel('todoList'));

		function ctrlFunc(getDataModel){
		var model = getDataModel('todoList');
		tasks = [];
		var i = 1;

		for (var j = 0; j < model.length; j++){
			if (model[j].done){
				tasks.push({
					i: i,
					name: model[j].name
				});
				i++;
			}
		}

		this.tasks = tasks;
		}

		window.x = x = {};
		var i1 = Symbol('dataModels');
		x[i1] = 'adsasdas';
		console.log(x);
		
		var i2 = Symbol('dataModels');
		console.log(x[i2]);
		console.log(x[i1]);
})();
