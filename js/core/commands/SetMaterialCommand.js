/**
 * Created by ljb on 2017/4/30.
 */

var SetMaterialCommand = function ( object, newMaterial ) {

	Command.call( this );

	this.type = 'SetMaterialCommand';
	this.name = 'New Material';

	this.object = object;
	this.oldMaterial = ( object !== undefined ) ? object.material : undefined;
	this.newMaterial = newMaterial;

};

SetMaterialCommand.prototype = {

	execute: function () {

		this.object.material = this.newMaterial;
		this.handler.signals.materialChanged.dispatch( this.newMaterial );

	},

	undo: function () {

		this.object.material = this.oldMaterial;
		this.handler.signals.materialChanged.dispatch( this.oldMaterial );

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.oldMaterial = this.oldMaterial.toJSON();
		output.newMaterial = this.newMaterial.toJSON();

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.handler.objectByUuid( json.objectUuid );
		this.oldMaterial = parseMaterial( json.oldMaterial );
		this.newMaterial = parseMaterial( json.newMaterial );


		function parseMaterial ( json ) {

			var loader = new THREE.ObjectLoader();
			var images = loader.parseImages( json.images );
			var textures  = loader.parseTextures( json.textures, images );
			var materials = loader.parseMaterials( [ json ], textures );
			return materials[ json.uuid ];

		}

	}

};
