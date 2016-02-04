(function () {
	'use stict';

	o.getModule('myApp')
		.createComponent({
			name: 'title',
			selector: "#title",
			template: templates.title,
			ctrlFunc: ctrlFunc
		})

		.addDataModel(o.getDataModel('todoList'))

		.activate();

		function ctrlFunc(getDataModel){
			var model = getDataModel('todoList');
			this.done = 0;
			this.undone = 0;

			for (var i = 0; i < model.length; i++) {
				if (model[i].done){
					this.done++;
				} else {
					this.undone++;
				}
			}

		}
})();
