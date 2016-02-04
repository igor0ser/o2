(function () {
	'use stict';

	o.getModule('myApp')
		.createComponent({
			name: 'form',
			selector: "#app",
			template: templates.form
		})

		.registerRoute('/form')

		.addDataModel(o.getDataModel('todoList'))

		.addListener('submit', 'form', 'todoList', function(event){
			event.preventDefault();
			return function(compEl, getDataModel){
				var model = getDataModel('todoList');

				model.push({
					id: model[model.length-1].id + 1,
					name: compEl.querySelector('.input-text').value,
					done: false
				});
			};
		});
})();
