(function () {
	'use stict';

	o.getModule('myApp')
		.createComponent({
			name: 'about',
			selector: "#app",
			template: templates.about
		})

			.registerRoute('/about');

})();
