/**
 * Created by ljb on 2017/4/30.
 */

var Loader = function ( handler ) {

    var scope = this;

    this.texturePath = '';

    this.loadFile = function ( file ) {

        var filename = file.name;
        var extension = filename.split( '.' ).pop().toLowerCase();

        var reader = new FileReader();
        reader.addEventListener( 'progress', function ( event ) {

            var size = '(' + Math.floor( event.total / 1024 ).format() + ' KB)';
            var progress = Math.floor( ( event.loaded / event.total ) * 100 ) + '%';
            console.log( 'Loading', filename, size, progress );

        } );

        switch ( extension ) {

            case 'json':

                reader.addEventListener( 'load', function ( event ) {

                    var contents = event.target.result;

                    var data;

                    try {

                        data = JSON.parse( contents );

                    } catch ( error ) {

                        alert( error );
                        return;

                    }

                    handleJSON( data, file, filename );

                }, false );
                reader.readAsText( file );

                break;


            default:

                alert( 'Unsupported file format (' + extension +  ').' );

                break;

        }

    };

    function handleJSON( data, file, filename ) {

        if ( data.metadata === undefined ) { // 2.0

            data.metadata = { type: 'Geometry' };

        }

        if ( data.metadata.type === undefined ) { // 3.0

            data.metadata.type = 'Geometry';

        }

        switch ( data.metadata.type.toLowerCase() ) {

            case 'geometry':

                var loader = new THREE.JSONLoader();
                loader.setTexturePath( scope.texturePath );

                var result = loader.parse( data );

                var geometry = result.geometry;
                var material;

                if ( result.materials !== undefined ) {

                    if ( result.materials.length > 1 ) {

                        material = new THREE.MultiMaterial( result.materials );

                    } else {

                        material = result.materials[ 0 ];

                    }

                } else {

                    material = new THREE.MeshStandardMaterial();

                }

                geometry.sourceType = "ascii";
                geometry.sourceFile = file.name;

                var mesh = new THREE.Mesh( geometry, material );

                mesh.name = filename;

                handler.execute( new AddObjectCommand( mesh ) );

                break;

            case 'object':

                var loader = new THREE.ObjectLoader();
                loader.setTexturePath( scope.texturePath );

                var result = loader.parse( data );

                if ( result instanceof THREE.Scene ) {

                    handler.execute( new SetSceneCommand( result ) );

                } else {

                    handler.execute( new AddObjectCommand( result ) );

                }

                break;

        }

    }

};
