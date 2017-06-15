/**
 * Created by ljb on 2017/4/30.
 */

ToolBar.File = function (handler) {

    var NUMBER_PRECISION = 6;

    function parseNumber( key, value ) {

        return typeof value === 'number' ? parseFloat( value.toFixed( NUMBER_PRECISION ) ) : value;

    }

    var container = new UI.Panel();
    container.setId( 'ToolBarFile' );

    // new / import / export
    var newButton = new UI.Button( 'New' );
    newButton.dom.title = 'Create a new project';
    newButton.onClick( function () {

        handler.clear();

    } );
    container.add( newButton );

    var fileInput = document.createElement( 'input' );
    fileInput.type = 'file';
    fileInput.addEventListener( 'change', function ( event ) {

        handler.loader.loadFile( fileInput.files[ 0 ] );

    } );

    var importButton = new UI.Button( 'Import' );
    importButton.dom.title = 'Import project';
    importButton.onClick( function () {

        fileInput.click();

    } );
    container.add( importButton );


    var exportButton = new UI.Button( 'Export' );
    exportButton.dom.title = 'Export project';
    exportButton.onClick( function () {

        var output = handler.scene.toJSON();
        try {

            output = JSON.stringify( output, parseNumber, '\t' );
            output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

        } catch ( e ) {

            output = JSON.stringify( output );

        }

        saveString( output, 'scene.json' );

    } );
    container.add( exportButton );

    function save( blob, filename ) {

        link.href = URL.createObjectURL( blob );
        link.download = filename || 'data.json';
        link.click();

    }

    function saveString( text, filename ) {

        save( new Blob( [ text ], { type: 'text/plain' } ), filename );

    }

    return container;
};
