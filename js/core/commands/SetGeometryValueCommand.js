/**
 * Created by ljb on 2017/4/30.
 */

var SetGeometryValueCommand = function ( object, attributeName, newValue ) {

	Command.call( this );

	this.type = 'SetGeometryValueCommand';
	this.name = 'Set Geometry.' + attributeName;

	this.object = object;
	this.attributeName = attributeName;
	this.oldValue = ( object !== undefined ) ? object.geometry[ attributeName ] : undefined;
	this.newValue = newValue;

};

SetGeometryValueCommand.prototype = {

	execute: function () {

		this.object.geometry[ this.attributeName ] = this.newValue;
		this.handler.signals.objectChanged.dispatch( this.object );
		this.handler.signals.geometryChanged.dispatch();
		this.handler.signals.sceneGraphChanged.dispatch();

	},

	undo: function () {

		this.object.geometry[ this.attributeName ] = this.oldValue;
		this.handler.signals.objectChanged.dispatch( this.object );
		this.handler.signals.geometryChanged.dispatch();
		this.handler.signals.sceneGraphChanged.dispatch();

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
