(function(global){
	'use strict';

	var doc = global.document;

/*=========        MODULE        =========*/

	//private list of modules
	var modules = [];

	//faking private field in Module using ES6 Symbols
	var componentSymbol = Symbol('components');

	class Module{
		constructor(name){
			//here module saves his components
			this[componentSymbol] = [];
			this.name = name;

			//we can get modules from this array using function getModule
			modules.push(this);
		}
		//creating new component and attaching it to this Module
		createComponent(obj){
			var comp = new Component(obj.selector, obj.template, obj.ctrlFunc);
			this[componentSymbol].push({
				name: obj.name,
				component: comp
			});
			return comp;
		}
		//getting component from Module using it's name
		getComponent(name){
			for (var i = 0; i < this[componentSymbol].length; i++) {
				if (this[componentSymbol][i].name === name){
					return this[componentSymbol][i].component;
				}
			}
		}
	}

	//public function to get Module by name
	function getModule(name){
		for (var i = 0; i < modules.length; i++) {
			if (modules[i].name === name){
				return modules[i];
			}
		}
	}


/*=========      COMPONENTS      =========*/

	//private list to registering routes
	var routeList = [];
	var routeListComplex = [];

	//faking private field in Component using ES6 Symbols
	var dataSymbol = Symbol('dataModels');

	class Component{
		constructor(selector, template, ctrlFunc){

			this.controller = new Controller(ctrlFunc);
			this.template = template;
			this.selector = selector;

			//we will insert our component in this element 
			this.elem = doc.querySelector(this.selector);
			//indicator that shows if this component is present on page now
			this.active = false;
			//private array for DataModels that are used by this Component
			this[dataSymbol] = {};
			//compiling our template
			this.controller.compile(this.template);
		}

		//insert our component on page
		activate(){
			this.elem.innerHTML = this.controller.getView(this.getDataModel.bind(this));
			this.active = true;
			return this;
		}

		//just set active to false
		deactivate(){
			this.active = false;
			return this;
		}

		//adding our component's route to route's array
		registerRoute(routeName){
			routeList.push({
				routeName: routeName,
				component: this
			});
			return this;
		}

		//adding our complex component's route to route's array
		registerComplexRoute(routeName){
			routeListComplex.push({
				routeName: routeName,
				component: this
			});
			return this;
		}

		//our component can use a lot of dataModels. They can be used in this component's controllers
		//adding link to dataModel to this component's array
		addDataModel(dataModel){
			dataModel.addToComponentList(this);
			this[dataSymbol][dataModel.name] = dataModel;
			return this;
		}

		//we will pass this function as a parameter to controller's functions and event listeners
		//to allow them use component's dataModels
		getDataModel(name){
			return this[dataSymbol][name].model;
		}

		//adding event listeners to our component
		registerDataChanger(eventName, selector, dataWillBeChanged, func){
			var _this = this;

			this.elem.addEventListener(eventName, function(event){
				if (event.target.matches(selector) && _this.active){
					var dataChanger = func(event);

					//passing getDataModel and DOM element to function-changer of DataModel
					dataChanger(_this.elem, _this.getDataModel.bind(_this));

					//after invocation of function all components that are using this dataModel
					//will be updated
					_this[dataSymbol][dataWillBeChanged].updateComponents();
				}

			});

		return this;
		}
	}



/*=========      CONTROLLER      =========*/

	class Controller{
		constructor(ctrlFunc){
			this.ctrlFunc = ctrlFunc || function(){};
		}
		compile(template){
			this.template = Handlebars.compile(template);
		}
		getView(getDataModel){
			return this.template(new this.ctrlFunc(getDataModel));
		}
	}


/*=========      DATAMODEL      =========*/

	//private list for saving models that are using in our application
	var dataList = {};

	//faking private field in DataModel using ES6 Symbols
	var compSymbol = Symbol('components');

	class DataModel{
		constructor(name, model){
			this.model = model;
			this.name = name;

			//list of components that are using this DataModel
			this[compSymbol] = [];

			//saving our DataModel in global list of DataModels
			dataList[name] = this;
		}
		addToComponentList(component){
			this[compSymbol].push(component);
		}
		updateComponents(){
			//update all components that are using this DataModel
			//something like Publish/Subscribe pattern here
			for (var i = 0; i < this[compSymbol].length; i++) {
				if (this[compSymbol][i].active) this[compSymbol][i].activate();
			}
		}
	}

	//public function to get DataModel by name from global list of DataModels
	function getDataModel(name){
		return dataList[name];
	}


/*=========       ROUTING       =========*/
	var ROUTE_EVENT_NAME = 'hashchange';
	var ONLOAD_EVENT_NAME = 'load';

	function hashChangeListener(e) {
		var URL = global.location.hash.slice(1);
		var x = URL.split('/');
		console.log(x);

		for (var i = 0; i < routeList.length; i++) {
			if (URL === routeList[i].routeName){
				deactivateComponentsBySelector(routeList[i].component.selector);
				routeList[i].component.activate();
			}
		}
	setLinksActive(URL);
	}

	//private function for deactivating components that using particular selector
	//when this selector becomes used by another components
	function deactivateComponentsBySelector(selector){
		for (var i = 0; i < modules.length; i++) {
			for (var j = 0; j < modules[i][componentSymbol].length; j++) {
				var comp = modules[i][componentSymbol][j].component;
				if (comp.selector === selector){
					comp.deactivate();
				}
			}
		}
	}

	//private function to add .active on current link and delete on others
	function setLinksActive(URL){
		var links = document.querySelectorAll('a[href^="#"]');
		var href = 'href';
		var hashURL = '#' + URL;

		for (var i = 0; i < links.length; i++) {
			if (links[i].getAttribute(href) === hashURL){
				links[i].classList.add('active');
			} else {
				links[i].classList.remove('active');
			}
		}
	}

	global.addEventListener(ROUTE_EVENT_NAME, hashChangeListener);
	global.addEventListener(ONLOAD_EVENT_NAME, hashChangeListener);

/*=========   REAVILING MODULE   =========*/

	var ownFramework = {
		Module: Module,
		getModule: getModule,

		DataModel: DataModel,
		getDataModel: getDataModel
	};
	global.o = global.ownFramework = ownFramework;

})(window);