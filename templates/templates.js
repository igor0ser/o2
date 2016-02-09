(function(){
	'use strict';

	// I'm using template syntax from ES6 here
	var templates = {
		title: `
			You have <b>{{done}}</b> done cases and <b>{{undone}}</b> undone cases
		`,
		todo: `
			<h3 class="text-center">
				Add some task
			</h3>
			<form class="text-center">
				<input 
					required type="text" 
					placeholder="Type another task here..."
					class="input-text form-control"/>
				<button class="btn btn-info">
					Add task
				</button>
			</form>
			<h3 class="text-center">
				Tasks to do
			</h3>
			<table class="table">
				<tr>
					<th>#</th>
					<th class="task">Task</th>
					<th>Done</th>
				</tr>
				{{#each tasks}}

				<tr>
					<td>{{this.i}}</td>
					<td>{{this.name}}</td>
					<td>
						<button class="btn btn-info" data-o-id={{this.id}}>
							Done
						</button>
					</td>
				</tr>

				{{/each}}
			</table>
		`,
		done: `
			<h3 class="text-center">
				Done tasks
			</h3>
			<table class="table">
				<tr>
					<th>#</th>
					<th>Task</th>
				</tr>

				{{#each tasks}}
				<tr>
					<td>{{this.i}}</td>
					<td>{{this.name}}</td>
				</tr>
				{{/each}}

			</table>
		`,
		about: `
			<div class="text-center">
				Welcome! This is todo application implemented using my own framework - <b>O</b>
				<img src="diagram/diagram.svg" class="diagramm">
			</div>
		`,
		task: `
			<div class="well">{{task.id}}</div>
			<div class="well">{{task.name}}</div>
			<div class="well">{{task.done}}</div>
		`
	};

	window.templates = templates;
})();