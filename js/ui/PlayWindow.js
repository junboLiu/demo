/**
 * Created by ljb on 2017/5/9.
 */

var PlayWindow = function ( handler ) {

    var signals = handler.signals;
    var isPlay = false;
    var vehicleLane = undefined;
    var velocityGraph = undefined;
    var densityGraph = undefined;
    var road = undefined;

    var container = new UI.Panel();
    container.setId( 'PlayWindow' );
    container.setPosition( 'absolute' );
    container.setDisplay( 'none' );

    var camera, playscene, renderer;
    playscene = new THREE.Scene();
    playscene.name = 'PlayScene';
    playscene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(70, 1, 1, 10000);
    camera.name = 'Camera';
    camera.position.set(0, 300, 900);
    camera.lookAt(new THREE.Vector3());
    playscene.add(camera);

    var light = new THREE.PointLight(0xffffff);
    light.position.set(0,800,0);
    playscene.add(light);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xffffff );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( container.dom.clientWidth-1, container.dom.clientHeight-1 );
    container.dom.appendChild( renderer.domElement);

    var stats = new Stats();
    container.dom.appendChild( stats.dom );

    var controls = new THREE.EditorControls( camera, container.dom );
    controls.addEventListener( 'change', function () {

        render();

    } );

    window.addEventListener( 'resize', function () {

        camera.aspect = container.dom.clientWidth-1 / container.dom.clientHeight-1;
        camera.updateProjectionMatrix();

        renderer.setSize( container.dom.clientWidth-1, container.dom.clientHeight-1 );

    } );

    signals.startPlay.add( function () {

        container.setDisplay( '' );

        camera.position.set(0, 300, 900);
        camera.lookAt(new THREE.Vector3());

        renderer.setSize( container.dom.clientWidth-1, container.dom.clientHeight-1 );
        play();

    } );

    signals.stopPlay.add( function () {

        container.setDisplay( 'none' );

        stop();

    } );

    function play() {

        isPlay = true;
        road = new Road(handler.road.curve);
        playscene.add(road);
        vehicleLane = new VehicleLane(road.roadMesh.geometry.vertices,road.parameters.ARC_SEGMENTS,road.parameters.Width);
        playscene.add(vehicleLane.particles);
        vehicleLane.addParticles();
        densityGraph = new DensityGraph(vehicleLane,handler.road.curve);
        densityGraph.position.set(0,300,0);
        velocityGraph = new VelocityGraph(vehicleLane,handler.road.curve);
        velocityGraph.position.set(0,290,100);
        playscene.add(velocityGraph);
        playscene.add(densityGraph);
    }

    function stop() {

        isPlay = false;
        playscene.remove(vehicleLane.particles);
        playscene.remove(road);
        playscene.remove(velocityGraph);
        playscene.remove(densityGraph);
    }


    function animate() {

        if (isPlay){
            vehicleLane.updateParticles();
            densityGraph.updateGeometry();
            velocityGraph.updateGeometry();
            render();
        }
        requestAnimationFrame( animate );

    }

    function render() {

        playscene.updateMatrixWorld();
        renderer.render(playscene, camera);
        stats.update();

    }

    requestAnimationFrame( animate );

    return container;

};
