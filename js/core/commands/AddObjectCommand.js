/**
 * Created by ljb on 2017/4/30.
 */

var AddObjectCommand = function ( object ) {

	Command.call( this );

	this.type = 'AddObjectCommand';

	this.object = object;
	if ( object !== undefined ) {

		this.name = 'Add Object: ' + object.name;

	}

};

AddObjectCommand.prototype = {

	execute: function () {

		this.handler.addObject( this.object );
		this.handler.select( this.object );

	},

	undo: function () {

		this.handler.removeObject( this.object );
		this.handler.deselect();

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );
		output.object = this.object.toJSON();

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.handler.objectByUuid( json.object.object.uuid );

		if ( this.object === undefined ) {

			var loader = new THREE.ObjectLoader();
			this.object = loader.parse( json.object );

		}

	}

};
