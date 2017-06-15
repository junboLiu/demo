/**
 * Created by ljb on 2017/5/1.
 */

var SetMaterialValueCommand = function ( object, attributeName, newValue ) {

	Command.call( this );

	this.type = 'SetMaterialValueCommand';
	this.name = 'Set Material.' + attributeName;
	this.updatable = true;

	this.object = object;
	this.oldValue = ( object !== undefined ) ? object.material[ attributeName ] : undefined;
	this.newValue = newValue;
	this.attributeName = attributeName;

};

SetMaterialValueCommand.prototype = {

	execute: function () {

		this.object.material[ this.attributeName ] = this.newValue;
		this.object.material.needsUpdate = true;
		this.handler.signals.objectChanged.dispatch( this.object );
		this.handler.signals.materialChanged.dispatch( this.object.material );

	},

	undo: function () {

		this.object.material[ this.attributeName ] = this.oldValue;
		this.object.material.needsUpdate = true;
		this.handler.signals.objectChanged.dispatch( this.object );
		this.handler.signals.materialChanged.dispatch( this.object.material );

	},

	update: function ( cmd ) {

		this.newValue = cmd.newValue;

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.attributeName = this.attributeName;
		output.oldValue = this.oldValue;
		output.newValue = this.newValue;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.attributeName = json.attributeName;
		this.oldValue = json.oldValue;
		this.newValue = json.newValue;
		this.object = this.handler.objectByUuid( json.objectUuid );

	}

};
