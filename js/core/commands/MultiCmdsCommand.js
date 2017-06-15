/**
 * Created by ljb on 2017/4/30.
 */

var MultiCmdsCommand = function ( cmdArray ) {

	Command.call( this );

	this.type = 'MultiCmdsCommand';
	this.name = 'Multiple Changes';

	this.cmdArray = ( cmdArray !== undefined ) ? cmdArray : [];

};

MultiCmdsCommand.prototype = {

	execute: function () {

		this.handler.signals.sceneGraphChanged.active = false;

		for ( var i = 0; i < this.cmdArray.length; i ++ ) {

			this.cmdArray[ i ].execute();

		}

		this.handler.signals.sceneGraphChanged.active = true;
		this.handler.signals.sceneGraphChanged.dispatch();

	},

	undo: function () {

		this.handler.signals.sceneGraphChanged.active = false;

		for ( var i = this.cmdArray.length - 1; i >= 0; i -- ) {

			this.cmdArray[ i ].undo();

		}

		this.handler.signals.sceneGraphChanged.active = true;
		this.handler.signals.sceneGraphChanged.dispatch();

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		var cmds = [];
		for ( var i = 0; i < this.cmdArray.length; i ++ ) {

			cmds.push( this.cmdArray[ i ].toJSON() );

		}
		output.cmds = cmds;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		var cmds = json.cmds;
		for ( var i = 0; i < cmds.length; i ++ ) {

			var cmd = new window[ cmds[ i ].type ]();	// creates a new object of type "json.type"
			cmd.fromJSON( cmds[ i ] );
			this.cmdArray.push( cmd );

		}

	}

};
