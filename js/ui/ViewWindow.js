/**
 * Created by ljb on 2017/4/30.
 */

var ViewWindow = function ( handler ) {

    var container = new UI.Panel();
    container.setId( 'ViewWindow' );
    container.setPosition( 'absolute' );

    var signals = handler.signals;
    var scene = handler.scene;
    var camera = handler.camera;
    scene.add(camera);

    var grid = new THREE.GridHelper( 1000, 100 );
    grid.position.y = -199;
    grid.material.opacity = 0.3;
    grid.material.transparent = true;
    scene.add( grid );

    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set(0,600,0);
    scene.add(spotLight);

    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xffffff );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( container.dom.width-1, container.dom.height );
    renderer.shadowMap.enabled = true;
    container.dom.appendChild( renderer.domElement );

    var objects = [];

    // Controls
    var objectPositionOnDown = null;
    var transformControls = new THREE.TransformControls( camera, container.dom );
    transformControls.addEventListener( 'change', function () {

        var object = transformControls.object;

        update(object);

        render();

    } );
    transformControls.addEventListener( 'mouseDown', function () {

        var object = transformControls.object;

        objectPositionOnDown = object.position.clone();

        controls.enabled = false;

    } );
    transformControls.addEventListener( 'mouseUp', function () {

        var object = transformControls.object;

        if ( object !== undefined ) {

            if ( ! objectPositionOnDown.equals( object.position ) ) {

                handler.execute(new SetPositionCommand( object, object.position, objectPositionOnDown ));

            }

        }

        controls.enabled = true;

    } );

    scene.add( transformControls );

    // object picking

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    function getMousePosition( dom, x, y ) {

        var rect = dom.getBoundingClientRect();
        return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

    }

    function getIntersects( point, objects ) {

        mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );

        raycaster.setFromCamera( mouse, camera );

        return raycaster.intersectObjects( objects ,true);

    }

    // events

    var onDownPosition = new THREE.Vector2();
    var onUpPosition = new THREE.Vector2();
    var onDoubleClickPosition = new THREE.Vector2();

    function handleClick() {

        if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {

            var intersects = getIntersects( onUpPosition, objects );

            if ( intersects.length > 0 ) {

                handler.select( intersects[ 0 ].object );

            } else {

                handler.select( null );

            }

            render();

        }

    }

    function onMouseDown( event ) {

        event.preventDefault();

        var array = getMousePosition( container.dom, event.clientX, event.clientY );
        onDownPosition.fromArray( array );

        document.addEventListener( 'mouseup', onMouseUp, false );

    }

    function onMouseUp( event ) {

        var array = getMousePosition( container.dom, event.clientX, event.clientY );
        onUpPosition.fromArray( array );

        handleClick();

        document.removeEventListener( 'mouseup', onMouseUp, false );

    }

    function onTouchStart( event ) {

        var touch = event.changedTouches[ 0 ];

        var array = getMousePosition( container.dom, touch.clientX, touch.clientY );
        onDownPosition.fromArray( array );

        document.addEventListener( 'touchend', onTouchEnd, false );

    }

    function onTouchEnd( event ) {

        var touch = event.changedTouches[ 0 ];

        var array = getMousePosition( container.dom, touch.clientX, touch.clientY );
        onUpPosition.fromArray( array );

        handleClick();

        document.removeEventListener( 'touchend', onTouchEnd, false );

    }

    function onDoubleClick( event ) {

        var array = getMousePosition( container.dom, event.clientX, event.clientY );
        onDoubleClickPosition.fromArray( array );

        var intersects =  getIntersects( onDoubleClickPosition, objects );

        if ( intersects.length > 0 ) {

            var object = intersects[0].object;
            signals.objectFocused.dispatch( object );

        } else {

            intersects =  getIntersects( onDoubleClickPosition, handler.curves );
            if ( intersects.length > 0 ) {
                if (intersects[0].object.name === 'controlCurve') {

                    var position = new THREE.Vector3();
                    var cameraPosition = camera.position.clone();
                    var directionVector = raycaster.ray.direction.clone();
                    position.x = cameraPosition.x + intersects[0].distance * directionVector.x;
                    position.y = cameraPosition.y + intersects[0].distance * directionVector.y;
                    position.z = cameraPosition.z + intersects[0].distance * directionVector.z;
                    addControlPoint(position, intersects[0].object);
                }

            }

        }

    }

    container.dom.addEventListener( 'mousedown', onMouseDown, false );
    container.dom.addEventListener( 'touchstart', onTouchStart, false );
    container.dom.addEventListener( 'dblclick', onDoubleClick, false );

    var controls = new THREE.EditorControls( camera, container.dom );
    controls.addEventListener( 'change', function () {

        transformControls.update();
        signals.cameraChanged.dispatch( camera );

    } );

    // signals

    signals.handlerCleared.add( function () {

        controls.center.set( 0, 0, 0 );
        clearAll();
        addRoad();
        render();

    } );

    signals.createAxisLabel.add(function (){

        var textGeo = new THREE.TextGeometry( 'X', {

            font:handler.font,
            size: 20,
            height: 1,
            curveSegments: 20

        });

        var textMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        var textMesh = new THREE.Mesh( textGeo, textMaterial );
        textMesh.position.copy( new THREE.Vector3(510,-209,-10) );
        textMesh.rotation.y = -1.57;
        scene.add(textMesh);
        var textGeo2 = new THREE.TextGeometry( 'Z', {

            font:handler.font,
            size: 20,
            height: 1,
            curveSegments: 20

        });
        var textMesh2 = new THREE.Mesh( textGeo2, textMaterial );
        textMesh2.position.copy( new THREE.Vector3(-10,-209,510) );
        scene.add(textMesh2);

    });

    var loader = new THREE.FontLoader();
    var hostPath = window.location.href.replace("index.html","");
    loader.load( hostPath + 'fonts/helvetiker_bold.typeface.json', function ( font ) {

        handler.font = font;
        handler.signals.createAxisLabel.dispatch();
        handler.signals.sceneGraphChanged.dispatch();

    });

    signals.sceneGraphChanged.add( function () {

        render();

    } );

    signals.cameraChanged.add( function () {

        render();

    } );

    signals.objectSelected.add( function ( object ) {

        transformControls.detach();

        if ( object !== null && object !== scene && object !== camera) {

            transformControls.attach( object );

        }

        render();

    } );

    signals.objectFocused.add( function ( object ) {

        controls.focus( object );

    } );

    signals.objectAdded.add( function ( object ) {

        object.traverse(function (child) {

            objects.push( child );

        });

    } );

    signals.objectChanged.add( function ( object ) {

        if ( handler.selected === object ) {

            transformControls.update();

        }

        if ( object instanceof THREE.PerspectiveCamera ) {

            object.updateProjectionMatrix();

        }

        render();

    } );

    signals.objectRemoved.add( function ( object ) {

        object.traverse(function (child) {

            objects.splice( objects.indexOf( child ), 1 );

        });

    } );

    signals.windowResize.add( function () {

        handler.DEFAULT_CAMERA.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
        handler.DEFAULT_CAMERA.updateProjectionMatrix();

        camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( container.dom.offsetWidth-1, container.dom.offsetHeight );

        render();

    } );

    var controlPointGeometry = new THREE.SphereBufferGeometry(5,16,16);
    var curvePointGeometry = new THREE.SphereBufferGeometry(8,16,16);
    var pointMaterial = new THREE.MeshBasicMaterial({
        color:0xff0000,
        transparent:true,
        opacity:0.75
    });
    var controlLineMaterial = new THREE.LineBasicMaterial({
        color:0xff0000,
        opacity:0.35
    });
    var curveLineMaterial = new THREE.MeshBasicMaterial({
        transparent:true,
        opacity:0.35,
        color:0x0000ff
    });

    //add
    addRoad();

    function addRoad() {

        var startPositions = [new THREE.Vector3(-450,100,0),new THREE.Vector3(-400,100,0)];
        var endPositions = [new THREE.Vector3(450,100,0),new THREE.Vector3(400,100,0)];
        var startPoint = new ControlPoint('startPoint',startPositions,curvePointGeometry,controlPointGeometry,pointMaterial,controlLineMaterial);
        var endPoint = new ControlPoint('endPoint',endPositions,curvePointGeometry,controlPointGeometry,pointMaterial,controlLineMaterial);
        var curve = new ControlCurve('controlCurve1',startPoint,endPoint,curveLineMaterial);
        startPoint.controlCurve1 = curve;
        endPoint.controlCurve1 = curve;
        handler.curves.push(curve);
        handler.addObject(startPoint);
        handler.addObject(endPoint);
        scene.add(curve);
        handler.road = new Road(curve.curve);
        scene.add(handler.road);
        handler.signals.sceneGraphChanged.dispatch();
    }

    function clearAll() {

        handler.curves = [];

    }

    function addControlPoint(position,object) {

        var parent = object.parent;
        var positions = [];
        var direction = parent.endPoint.curvePoint.position.clone().sub(parent.startPoint.curvePoint.position).normalize();
        positions.push(position);
        positions.push(position.clone().sub(direction.clone().multiplyScalar(50)));
        positions.push(position.clone().add(direction.clone().multiplyScalar(50)));
        var midPoint = new ControlPoint('midPoint' + handler.curves.length,positions,curvePointGeometry,controlPointGeometry,pointMaterial,controlLineMaterial);
        var curve = new ControlCurve('controlCurve'+ (handler.curves.length+1),parent.startPoint,midPoint,curveLineMaterial);
        if(parent.startPoint.num_controlPoint === 1){
            parent.startPoint.controlCurve1 = curve;
        }else {
            parent.startPoint.controlCurve2 = curve;
        }
        midPoint.controlCurve1 = curve;
        midPoint.controlCurve2 = parent;
        handler.curves.splice(handler.curves.indexOf(parent),0,curve);
        scene.add(curve);
        handler.addObject(midPoint);
        parent.update(midPoint,parent.endPoint);
        parent.endPoint.controlCurve1 = parent;
        handler.select(midPoint.curvePoint);

        render();

    }

    function update(object) {

        var parent = object.parent;
        if (parent.type === 'Point') {

            if (object.type ==='curvePoint') {

                parent.controlPoint1.position.copy(object.position.clone().sub(parent.relativeDistance1));
                parent.controlLine1.geometry.verticesNeedUpdate = true;
                parent.controlCurve1.update();
                if(parent.num_controlPoint > 1){

                    parent.controlPoint2.position.copy(object.position.clone().sub(parent.relativeDistance2));
                    parent.controlLine2.geometry.verticesNeedUpdate = true;
                    parent.controlCurve2.update();

                }
            } else if (object.type ==='controlPoint1') {

                parent.relativeDistance1 = parent.curvePoint.position.clone().sub(object.position);
                parent.controlLine1.geometry.verticesNeedUpdate = true;
                parent.controlCurve1.update();

            } else if (object.type ==='controlPoint2'){

                parent.relativeDistance2 = parent.curvePoint.position.clone().sub(object.position);
                parent.controlLine2.geometry.verticesNeedUpdate = true;
                parent.controlCurve2.update();
            }

            var curvePoint = [];
            var length = handler.curves.length;
            for(var i = 0;  i < length; i++){

                var points = handler.curves[i].curve.getPoints(handler.curves[i].parameters.ARC_SEGMENTS);
                if(i !== length -1){
                    points.pop();
                }
                curvePoint.push.apply(curvePoint,points);
            }
            var curve = new THREE.CatmullRomCurve3(curvePoint);
            curve.tension = 0.5;
            scene.remove(handler.road);
            handler.road = new Road(curve);
            scene.add(handler.road);
        }

    }
    //

    function animate() {

        requestAnimationFrame( animate );
        render();

    }

    function render() {

        scene.updateMatrixWorld();
        renderer.render(scene, camera);

    }

    requestAnimationFrame( animate );

    return container;

};
