/**
 * Created by ljb on 2017/4/30.
 */

var RemoveObjectCommand = function ( object ) {

	Command.call( this );

	this.type = 'RemoveObjectCommand';
	this.name = 'Remove Object';

	this.object = object;
	this.parent = ( object !== undefined ) ? object.parent : undefined;
	if ( this.parent !== undefined ) {

		this.index = this.parent.children.indexOf( this.object );

	}

};

RemoveObjectCommand.prototype = {

	execute: function () {

		this.parent.remove( this.object );
		this.handler.select( this.parent );

		this.handler.signals.objectRemoved.dispatch( this.object );
		this.handler.signals.sceneGraphChanged.dispatch();

	},

	undo: function () {

		var scope = this.handler;

		this.object.traverse( function ( child ) {

			if ( child.geometry !== undefined ) scope.addGeometry( child.geometry );
			if ( child.material !== undefined ) scope.addMaterial( child.material );

		} );

		this.parent.children.splice( this.index, 0, this.object );
		this.object.parent = this.parent;
		this.handler.select( this.object );

		this.handler.signals.objectAdded.dispatch( this.object );
		this.handler.signals.sceneGraphChanged.dispatch();

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );
		output.object = this.object.toJSON();
		output.index = this.index;
		output.parentUuid = this.parent.uuid;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.parent = this.handler.objectByUuid( json.parentUuid );
		if ( this.parent === undefined ) {

			this.parent = this.handler.scene;

		}

		this.index = json.index;

		this.object = this.handler.objectByUuid( json.object.object.uuid );
		if ( this.object === undefined ) {

			var loader = new THREE.ObjectLoader();
			this.object = loader.parse( json.object );

		}

	}

};
