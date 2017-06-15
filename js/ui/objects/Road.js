/**
 * Created by ljb on 2017/5/9.
 */

var Road = function (curve) {

    THREE.Object3D.call(this);
    var self = this;
    this.type = 'road';
    this.curve = curve;
    var roadMaterial = new THREE.MeshLambertMaterial({
        color:0x708090,
        side:THREE.DoubleSide
    });
    var laneLineMaterial = new THREE.LineBasicMaterial({
        color:0xffffff
    });
    var laneDashedLineMaterial = new THREE.LineDashedMaterial({
        dashSize:30,
        gapSize:10,
        color:0xffffff
    });

    this.parameters = {
        ARC_SEGMENTS: 99,
        Width: 49
    };

    var roadSurface = function(u,v){
        var tangent = new THREE.Vector3();
        tangent.subVectors(curve.getPoint((u*(self.parameters.ARC_SEGMENTS+1)+1)/(self.parameters.ARC_SEGMENTS+1)),curve.getPoint(u));
        var direction = new THREE.Vector3(0,-8,0);
        direction.z = Math.sqrt((Math.pow(tangent.x,2) * Math.pow(v*(self.parameters.Width+1),2))/(Math.pow(tangent.x,2)+Math.pow(tangent.z,2)));
        direction.x = (-tangent.z * direction.z)/ tangent.x;
        return curve.getPoint(u).add(direction);
    };
    this.roadGeometry = new THREE.ParametricGeometry(roadSurface,this.parameters.ARC_SEGMENTS,this.parameters.Width);
    this.roadGeometry.computeFaceNormals();
    this.roadMesh = new THREE.Mesh( this.roadGeometry, roadMaterial );
    this.roadMesh.type = 'roadMesh';
    this.add(this.roadMesh);

    var laneLineGeometry1 = new THREE.Geometry();
    laneLineGeometry1.vertices = this.roadGeometry.vertices.slice(5*(this.parameters.ARC_SEGMENTS+1),6*(this.parameters.ARC_SEGMENTS+1));
    laneLineGeometry1.computeLineDistances();
    var laneLine1 = new THREE.Line(laneLineGeometry1,laneLineMaterial);
    var laneLineGeometry2 = new THREE.Geometry();
    laneLineGeometry2.vertices = this.roadGeometry.vertices.slice(45*(this.parameters.ARC_SEGMENTS+1),46*(this.parameters.ARC_SEGMENTS+1));
    laneLineGeometry2.computeLineDistances();
    var laneLine2 = new THREE.Line(laneLineGeometry2,laneLineMaterial);

    var laneLineGeometry3 = new THREE.Geometry();
    laneLineGeometry3.vertices = this.roadGeometry.vertices.slice(15*(this.parameters.ARC_SEGMENTS+1),16*(this.parameters.ARC_SEGMENTS+1));
    laneLineGeometry3.computeLineDistances();
    var laneLine3 = new THREE.Line(laneLineGeometry3,laneDashedLineMaterial,THREE.LineSegments);

    var laneLineGeometry4 = new THREE.Geometry();
    laneLineGeometry4.vertices = this.roadGeometry.vertices.slice(25*(this.parameters.ARC_SEGMENTS+1),26*(this.parameters.ARC_SEGMENTS+1));
    laneLineGeometry4.computeLineDistances();
    var laneLine4 = new THREE.Line(laneLineGeometry4,laneDashedLineMaterial,THREE.LineSegments);

    var laneLineGeometry5 = new THREE.Geometry();
    laneLineGeometry5.vertices = this.roadGeometry.vertices.slice(35*(this.parameters.ARC_SEGMENTS+1),36*(this.parameters.ARC_SEGMENTS+1));
    laneLineGeometry5.computeLineDistances();
    var laneLine5 = new THREE.Line(laneLineGeometry5,laneDashedLineMaterial,THREE.LineSegments);

    this.add(laneLine1);
    this.add(laneLine2);
    this.add(laneLine3);
    this.add(laneLine4);
    this.add(laneLine5);
    return this;

};

Road.prototype = Object.assign(Object.create( THREE.Object3D.prototype ));
Road.prototype.constructor = Road;
