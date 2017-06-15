/**
 * Created by ljb on 2017/4/30.
 */

var handler = function () {

    this.DEFAULT_CAMERA = new THREE.PerspectiveCamera(70, 1, 1, 10000);
    this.DEFAULT_CAMERA.name = 'Camera';
    this.DEFAULT_CAMERA.position.set(0, 300, 900);
    this.DEFAULT_CAMERA.lookAt(new THREE.Vector3());

    var Signal = signals.Signal;

    this.signals = {

        //clear
        handlerCleared: new Signal(),

        // player
        startPlay: new Signal(),
        stopPlay: new Signal(),

        //autoSave
        savingStarted: new Signal(),
        savingFinished: new Signal(),

        //scene
        sceneGraphChanged: new Signal(),
        createAxisLabel:new Signal(),


        //camera
        cameraChanged: new Signal(),

        //object
        objectSelected: new Signal(),
        objectFocused: new Signal(),
        objectChanged: new Signal(),
        objectAdded: new Signal(),
        objectRemoved: new Signal(),

        geometryChanged: new Signal(),

        //road
        showRoad:new Signal(),

        windowResize: new Signal()

    };

    this.config = new Config('Demo-TFSS');
    this.history = new History(this);
    this.storage = new Storage();
    this.loader = new Loader(this);

    this.camera = this.DEFAULT_CAMERA.clone();

    this.scene = new THREE.Scene();
    this.scene.name = 'Scene';
    this.scene.background = new THREE.Color(0xffffff);

    this.object = {};

    this.selected = null;

    this.font = undefined;
    this.curves = [];
    this.road = undefined;

};

handler.prototype = {

    setScene: function (scene) {

        this.scene.uuid = scene.uuid;
        this.scene.name = scene.name;

        if (scene.background !== null) this.scene.background = scene.background.clone();

        this.scene.userData = JSON.parse(JSON.stringify(scene.userData));

        this.signals.sceneGraphChanged.active = false;

        while (scene.children.length > 0) {

            this.addObject(scene.children[0]);

        }

        this.signals.sceneGraphChanged.active = true;
        this.signals.sceneGraphChanged.dispatch();

    },


    addObject: function (object) {

        this.scene.add(object);

        this.signals.objectAdded.dispatch(object);
        this.signals.sceneGraphChanged.dispatch();

    },

    removeObject: function (object) {

        if (object.parent === null) return;

        object.parent.remove(object);

        this.signals.objectRemoved.dispatch(object);
        this.signals.sceneGraphChanged.dispatch();

    },


    select: function (object) {

        if (this.selected === object) return;

        var uuid = null;

        if (object !== null) {

            uuid = object.uuid;

        }

        this.selected = object;

        this.config.setKey('selected', uuid);
        this.signals.objectSelected.dispatch(object);

    },

    deselect: function () {

        this.select(null);

    },

    focus: function (object) {

        this.signals.objectFocused.dispatch(object);

    },

    clear: function () {

        this.history.clear();
        this.storage.clear();

        this.camera.copy(this.DEFAULT_CAMERA);

        var objects = this.scene.children;

        while (objects.length > 0) {

            this.removeObject(objects[0]);

        }

        this.deselect();

        this.signals.handlerCleared.dispatch();

    },

    //

    fromJSON: function (json) {

        var loader = new THREE.JSONLoader();

        if (json.scene === undefined) {

            this.setScene(loader.parse(json));
            return;

        }

        var camera = loader.parse(json.camera);

        this.camera.copy(camera);
        this.camera.aspect = this.DEFAULT_CAMERA.aspect;
        this.camera.updateProjectionMatrix();

        this.history.fromJSON(json.history);

        this.setScene(loader.parse(json.scene));

    },

    toJSON: function () {

        return {

            camera: this.camera.toJSON(),
            scene: this.scene.toJSON(),
            history: this.history.toJSON()

        };

    },

    objectByUuid: function (uuid) {

        return this.scene.getObjectByProperty('uuid', uuid, true);

    },

    execute: function (cmd, optionalName) {

        this.history.execute(cmd, optionalName);

    },

    undo: function () {

        this.history.undo();

    },

    redo: function () {

        this.history.redo();

    }

};

