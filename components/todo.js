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

		.registerDataChanger('submit', 'form', 'todoList', function(event){
			event.preventDefault();
			return function(compElement, getDataModel){
				var model = getDataModel('todoList');

				model.push({
					id: model[model.length-1].id + 1,
					name: compElement.querySelector('.input-text').value,
					done: false
				});
			};
		})

		.registerDataChanger('click', 'button[data-o-id]', 'todoList', function(event){

			return function(compElement, getDataModel){
				var id = event.target.getAttribute('data-o-id');
				var model = getDataModel('todoList');
				//console.log(model);
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
