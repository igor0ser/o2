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
		}

		//this function is used by function deactivateComponentsBySelector
		deactivate(){
			this.active = false;
		}

		//adding our component's route to route's array
		registerRoute(routeName){
			routeList.push({
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

		//we will pass this function as a parameter to controller's functions
		//and event listeners to allow them use component's dataModels
		getDataModel(name){
			return this[dataSymbol][name].model;
		}

		//adding event listeners to our component
		addListener(eventName, selector, dataNameWillBeChanged, func){
			var _this = this;

			this.elem.addEventListener(eventName, function(event){
				if (event.target.matches(selector)){
					var resFunc = func(event);

					//passing getDataModel to result function of listener
					resFunc(_this.elem, _this.getDataModel.bind(_this));

					//we passing to listener name of dataModel that will be changed
					//after invocation of function all components that are using this dataModel
					//will be updated
					_this[dataSymbol][dataNameWillBeChanged].updateComponents();
				}

			});
		}
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

			//saving our DataModel in global list om DataModels
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

	//public function to get DataModel by name
	function getDataModel(name){
		return dataList[name];
	}


/*=========       ROUTING       =========*/
	var ROUTE_EVENT_NAME = 'hashchange';

	function hashChangeListener(event) {
		var URL = event.newURL.split('#')[1];

		for (var i = 0; i < routeList.length; i++) {
			if (URL === routeList[i].routeName){
				deactivateComponentsBySelector(routeList[i].component.selector);
				routeList[i].component.activate();
			}
		}
	}

	global.addEventListener(ROUTE_EVENT_NAME, hashChangeListener);


/*=========   REAVILING MODULE   =========*/

	var ownFramework = {
		Module: Module,
		getModule: getModule,

		DataModel: DataModel,
		getDataModel: getDataModel
	};
	global.o = global.ownFramework = ownFramework;

})(window);