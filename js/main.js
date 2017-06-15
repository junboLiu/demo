
window.URL = window.URL || window.webkitURL;
window.BlobBuilder = window.BlobBuilder || window.webkitBlobBuilder || window.mozBlobBuilder;

Number.prototype.format = function () {
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1,");
};
var header = new header();
document.body.appendChild(header.dom);

var handler = new handler();

var toolBar = new ToolBar(handler);
document.body.appendChild(toolBar.dom);

var viewWindow = new ViewWindow(handler);
document.body.appendChild(viewWindow.dom);

var playWindow = new PlayWindow(handler);
document.body.appendChild(playWindow.dom);

var sph = new SPH();
var controlGui = new dat.GUI({ width: 400 } );
var gui_parameters = controlGui.addFolder('Parameters');
gui_parameters.add(sph.parameters,'gamma').min(1).max(5).step(1).name('gamma = ');
gui_parameters.add(sph.parameters,'supportRadius').min(3).max(16).step(0.5).name('supportRadius = ');
gui_parameters.add(sph.parameters,'particleMass').min(40).max(80).step(1).name('particleMass = ');
gui_parameters.add(sph.parameters,'pressureCoefficient').min(1).max(10).step(1).name('pressureCoefficient = ');
gui_parameters.add(sph.parameters,'viscousityCoefficient').min(4000).max(14000).step(1).name('viscousityCoefficient = ');
gui_parameters.add(sph.parameters,'dampingFactor').min(1).max(2).step(1).name('dampingFactor = ');
gui_parameters.add(sph.parameters,'externalAcceleration').min(30).max(300).step(10).name('externalAcceleration = ');
gui_parameters.open();
controlGui.open();

//var sideBar = new SideBar(handler);
//document.body.appendChild(sideBar.dom);

var footer = new footer();
document.body.appendChild(footer.dom);

handler.storage.init(function () {

    handler.storage.get(function (state) {

        if(isLoadingFromHash) return;

        if(state !== undefined) {

            //handler.fromJSON(state);

        }

    });

    var timeout;

    function saveState( scene ) {

        if (handler.config.getKey('autosave') === false) {

            return;

        }

        clearTimeout(timeout);

        timeout = setTimeout(function () {

            handler.signals.savingStarted.dispatch();

            timeout = setTimeout(function () {

                handler.storage.set(handler.toJSON());

                handler.signals.savingFinished.dispatch();

            }, 100);

        }, 1000);
    }

    // var signals = handler.signals;

    //signals.objectAdded.add( saveState );
    //signals.objectChanged.add( saveState );
    //signals.objectRemoved.add( saveState );
    //signals.materialChanged.add( saveState );
    //signals.sceneGraphChanged.add( saveState );
});

document.addEventListener( 'dragover', function ( event ) {

    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';

}, false );

document.addEventListener( 'drop', function ( event ) {

    event.preventDefault();

    if ( event.dataTransfer.files.length > 0 ) {

        handler.loader.loadFile( event.dataTransfer.files[ 0 ] );

    }

}, false );

document.addEventListener( 'keydown', function ( event ) {

    switch ( event.keyCode ) {

        case 8: // backspace

            event.preventDefault();

        case 46: // delete

            var object = handler.selected;

            if ( confirm( 'Delete ' + object.name + '?' ) === false ) return;

            var parent = object.parent;
            if ( parent !== null ) handler.execute( new RemoveObjectCommand( object ) );

            break;

        case 90:

            if ( event.ctrlKey && event.shiftKey ) {

                //handler.redo();

            } else if ( event.ctrlKey ) {

                //handler.undo();

            }

            break;

    }

}, false );

function onWindowResize( event ) {

    handler.signals.windowResize.dispatch();

}

window.addEventListener( 'resize', onWindowResize, false );

onWindowResize();

var isLoadingFromHash = false;
var hash = window.location.hash;

if ( hash.substr( 1, 5 ) === 'file=' ) {

    var file = hash.substr( 6 );

    if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

        var loader = new THREE.FileLoader();
        loader.crossOrigin = '';
        loader.load( file, function ( text ) {

            handler.clear();
            handler.fromJSON( JSON.parse( text ) );

        } );

        isLoadingFromHash = true;

    }

}