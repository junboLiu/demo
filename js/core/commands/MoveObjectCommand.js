/**
 * Created by ljb on 2017/4/30.
 */

var MoveObjectCommand = function ( object, newParent, newBefore ) {

	Command.call( this );

	this.type = 'MoveObjectCommand';
	this.name = 'Move Object';

	this.object = object;
	this.oldParent = ( object !== undefined ) ? object.parent : undefined;
	this.oldIndex = ( this.oldParent !== undefined ) ? this.oldParent.children.indexOf( this.object ) : undefined;
	this.newParent = newParent;

	if ( newBefore !== undefined ) {

		this.newIndex = ( newParent !== undefined ) ? newParent.children.indexOf( newBefore ) : undefined;

	} else {

		this.newIndex = ( newParent !== undefined ) ? newParent.children.length : undefined;

	}

	if ( this.oldParent === this.newParent && this.newIndex > this.oldIndex ) {

		this.newIndex --;

	}

	this.newBefore = newBefore;

};

MoveObjectCommand.prototype = {

	execute: function () {

		this.oldParent.remove( this.object );

		var children = this.newParent.children;
		children.splice( this.newIndex, 0, this.object );
		this.object.parent = this.newParent;

		this.handler.signals.sceneGraphChanged.dispatch();

	},

	undo: function () {

		this.newParent.remove( this.object );

		var children = this.oldParent.children;
		children.splice( this.oldIndex, 0, this.object );
		this.object.parent = this.oldParent;

		this.handler.signals.sceneGraphChanged.dispatch();

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.newParentUuid = this.newParent.uuid;
		output.oldParentUuid = this.oldParent.uuid;
		output.newIndex = this.newIndex;
		output.oldIndex = this.oldIndex;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.handler.objectByUuid( json.objectUuid );
		this.oldParent = this.handler.objectByUuid( json.oldParentUuid );
		if ( this.oldParent === undefined ) {

			this.oldParent = this.handler.scene;

		}
		this.newParent = this.handler.objectByUuid( json.newParentUuid );
		if ( this.newParent === undefined ) {

			this.newParent = this.handler.scene;

		}
		this.newIndex = json.newIndex;
		this.oldIndex = json.oldIndex;

	}

};
