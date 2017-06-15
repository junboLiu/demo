/**
 * Created by ljb on 2017/4/30.
 */

var SetColorCommand = function ( object, attributeName, newValue ) {

	Command.call( this );

	this.type = 'SetColorCommand';
	this.name = 'Set ' + attributeName;
	this.updatable = true;

	this.object = object;
	this.attributeName = attributeName;
	this.oldValue = ( object !== undefined ) ? this.object[ this.attributeName ].getHex() : undefined;
	this.newValue = newValue;

};

SetColorCommand.prototype = {

	execute: function () {

		this.object[ this.attributeName ].setHex( this.newValue );
		this.handler.signals.objectChanged.dispatch( this.object );

	},

	undo: function () {

		this.object[ this.attributeName ].setHex( this.oldValue );
		this.handler.signals.objectChanged.dispatch( this.object );

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

		this.object = this.handler.objectByUuid( json.objectUuid );
		this.attributeName = json.attributeName;
		this.oldValue = json.oldValue;
		this.newValue = json.newValue;

	}

};