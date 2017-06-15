/**
 * Created by ljb on 2017/5/9.
 */

var ControlPoint = function (name, positions,curvePointGeometry,controlPointGeometry,pointMaterial,controlLineMaterial) {

    THREE.Object3D.call(this);

    this.type = 'Point';
    this.name = name;
    this.controlCurve1 = undefined;
    this.controlCurve2 = undefined;
    this.curvePoint = new THREE.Mesh( curvePointGeometry, pointMaterial);
    this.curvePoint.type = 'curvePoint';
    this.curvePoint.position.copy( positions[0] );
    this.add(this.curvePoint);

    this.controlPoint1 = new THREE.Mesh( controlPointGeometry, pointMaterial);
    this.controlPoint1.type = 'controlPoint1';
    this.controlPoint1.position.copy( positions[1] );
    this.add(this.controlPoint1);

    var LineGeometry1 = new THREE.Geometry();
    LineGeometry1.vertices.push(this.curvePoint.position);
    LineGeometry1.vertices.push(this.controlPoint1.position);
    this.controlLine1 = new THREE.Line(LineGeometry1, controlLineMaterial);
    this.controlLine1.type = 'controlLine';
    this.add(this.controlLine1);
    this.relativeDistance1 = this.curvePoint.position.clone().sub(this.controlPoint1.position);

    var num_controlPoint = 1;
    if(this.name !== 'startPoint' && this.name !== 'endPoint'){

        this.controlPoint2 = new THREE.Mesh( controlPointGeometry, pointMaterial);
        this.controlPoint2.type = 'controlPoint2';
        this.controlPoint2.position.copy( positions[2] );
        this.add(this.controlPoint2);

        var LineGeometry2 = new THREE.Geometry();
        LineGeometry2.vertices.push(this.curvePoint.position);
        LineGeometry2.vertices.push(this.controlPoint2.position);
        this.controlLine2 = new THREE.Line(LineGeometry2, controlLineMaterial);
        this.controlLine2.type = 'controlLine';
        this.add(this.controlLine2);

        this.relativeDistance2 = this.curvePoint.position.clone().sub(this.controlPoint2.position);
        num_controlPoint = 2;

    }

    this.num_controlPoint = num_controlPoint;

    return this;

};

ControlPoint.prototype = Object.assign(Object.create( THREE.Object3D.prototype ));
ControlPoint.prototype.constructor = ControlPoint;
