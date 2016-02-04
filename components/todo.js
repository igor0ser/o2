(function () {
	'use stict';

	o.getModule('myApp')
		.createComponent({
			name: 'todo',
			selector: "#app",
			template: templates.todo,
			ctrlFunc: ctrlFunc
		})

		.registerRoute('/todo')

		.addDataModel(o.getDataModel('todoList'))

		.addListener('click', 'button[data-o-id]', 'todoList', function(event){

			return function(compEl, getDataModel){
				var id = event.target.getAttribute('data-o-id');
				var model = getDataModel('todoList');
				for (var i = 0; i < model.length; i++) {
					if (model[i].id == id){
						model[i].done = true;
						return;
					}
				}
			};
		});

	function ctrlFunc(getDataModel){
		var model = getDataModel('todoList');
		tasks = [];
		var i = 1;

		for (var j = 0; j < model.length; j++){
			if (!model[j].done){
				tasks.push({
					i: i,
					name: model[j].name,
					id: model[j].id
				});
				i++;
			}
		}

		this.tasks = tasks;
	}

})();
