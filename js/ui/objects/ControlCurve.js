/**
 * Created by ljb on 2017/5/9.
 */
var ControlCurve = function (name,startPoint,endPoint,curveMaterial) {

    THREE.Object3D.call(this);

    this.name = name;
    this.type = 'controlCurve';
    this.parameters = {
        ARC_SEGMENTS: 200,
        Radius: 2,
        RadiusSegments: 8
    };
    this.startPoint = startPoint;
    this.endPoint = endPoint;

    var curve = undefined;
    if (startPoint.num_controlPoint === 1) {

        curve = new THREE.CubicBezierCurve3( startPoint.curvePoint.position, startPoint.controlPoint1.position,
            endPoint.controlPoint1.position, endPoint.curvePoint.position );

    } else{

        curve = new THREE.CubicBezierCurve3( startPoint.curvePoint.position, startPoint.controlPoint2.position,
            endPoint.controlPoint1.position, endPoint.curvePoint.position );

    }

    this.curve = curve;
    var geometry = new THREE.TubeBufferGeometry(this.curve,this.parameters.ARC_SEGMENTS,this.parameters.Radius,this.parameters.RadiusSegments,false);
    this.mesh = new THREE.Mesh(geometry,curveMaterial);
    this.mesh.name = 'controlCurve';
    this.add(this.mesh);

    return this;

};

ControlCurve.prototype = Object.assign(Object.create( THREE.Object3D.prototype ));
ControlCurve.prototype.constructor = ControlCurve;
ControlCurve.prototype.update = function (startPoint, endPoint) {

    if (startPoint !== undefined && endPoint !== undefined) {

        var curve = undefined;
        if (startPoint.num_controlPoint === 1) {

            curve = new THREE.CubicBezierCurve3(startPoint.curvePoint.position, startPoint.controlPoint1.position,
                endPoint.controlPoint1.position, endPoint.curvePoint.position);

        } else {

            curve = new THREE.CubicBezierCurve3(startPoint.curvePoint.position, startPoint.controlPoint2.position,
                endPoint.controlPoint1.position, endPoint.curvePoint.position);

        }

        this.curve = curve;
        this.startPoint = startPoint;
        this.endPoint = endPoint;

    }

    var newGeometry = new THREE.TubeBufferGeometry(this.curve, this.parameters.ARC_SEGMENTS, this.parameters.Radius, this.parameters.RadiusSegments, false);
    this.mesh.geometry.dispose();
    this.mesh.geometry = newGeometry;
};
