/**
 * Created by ljb on 2017/5/1.
 */

var SetUuidCommand = function ( object, newUuid ) {

	Command.call( this );

	this.type = 'SetUuidCommand';
	this.name = 'Update UUID';

	this.object = object;

	this.oldUuid = ( object !== undefined ) ? object.uuid : undefined;
	this.newUuid = newUuid;

};

SetUuidCommand.prototype = {

	execute: function () {

		this.object.uuid = this.newUuid;
		this.handler.signals.objectChanged.dispatch( this.object );
		this.handler.signals.sceneGraphChanged.dispatch();

	},

	undo: function () {

		this.object.uuid = this.oldUuid;
		this.handler.signals.objectChanged.dispatch( this.object );
		this.handler.signals.sceneGraphChanged.dispatch();

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.oldUuid = this.oldUuid;
		output.newUuid = this.newUuid;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.oldUuid = json.oldUuid;
		this.newUuid = json.newUuid;
		this.object = this.handler.objectByUuid( json.oldUuid );

		if ( this.object === undefined ) {

			this.object = this.handler.objectByUuid( json.newUuid );

		}

	}

};
