/**
 * Created by ljb on 2017/5/16.
 */

var VelocityGraph = function (vehicleLane,curve) {

    THREE.Object3D.call(this);
    this.type = 'VelocityGraph';
    this.curve = curve;
    this.vehicleLane = vehicleLane;
    var self = this;
    var material = new THREE.MeshLambertMaterial( { vertexColors: THREE.VertexColors, side:THREE.DoubleSide } );

    this.parameters = {
        ARC_SEGMENTS: 99,
        Width: 49
    };

    var surface = function(u,v){
        var tangent = new THREE.Vector3();
        tangent.subVectors(curve.getPoint((u*(self.parameters.ARC_SEGMENTS+1)+1)/(self.parameters.ARC_SEGMENTS+1)),curve.getPoint(u));
        var direction = new THREE.Vector3(0,0,0);
        direction.z = Math.sqrt((Math.pow(tangent.x,2) * Math.pow(v*(self.parameters.Width+1),2))/(Math.pow(tangent.x,2)+Math.pow(tangent.z,2)));
        direction.x = (-tangent.z * direction.z)/ tangent.x;
        return curve.getPoint(u).add(direction);
    };

    var geometry = new THREE.ParametricGeometry(surface,this.parameters.ARC_SEGMENTS,this.parameters.Width);
    this.geometry = geometry;
    this.VelocityGraphMesh = new THREE.Mesh( geometry, material );
    this.VelocityGraphMesh.type = 'VelocityGraphMesh';
    this.add(this.VelocityGraphMesh);

    return this;
};

VelocityGraph.prototype = Object.assign(Object.create( THREE.Object3D.prototype ));
VelocityGraph.prototype.constructor = VelocityGraph;

VelocityGraph.prototype.updateGeometry = function () {

    var length = this.geometry.vertices.length;
    var vertice = new THREE.Vector3(),neighbor,neighborLength,vel,i,j;
    for(i = 0; i < length; i++){
        vertice.copy(this.geometry.vertices[i]);
        vertice.y -= 4;
        neighbor = this.vehicleLane.sph.kdTree.nearest(vertice,this.vehicleLane.sph.parameters.supportRadius);
        neighborLength = neighbor.length;
        vel = new THREE.Vector3(0,0,0);
        for(j = 0; j < neighborLength; j++){

            vel.add(neighbor[j].parameters.vel);

        }

        if(neighborLength > 0){
            vel.divideScalar(neighborLength);
        }
        this.geometry.vertices[i].y = 100 - vel.length();
    }
    this.geometry.computeBoundingBox();
    var zMin = this.geometry.boundingBox.min.z;
    var zMax = this.geometry.boundingBox.max.z;
    var zRange = zMax-zMin;
    var color,point,face, numberOfSides, vertexIndex;
    var faceIndices = [ 'a', 'b', 'c', 'd' ];
    for ( i = 0; i < this.geometry.faces.length; i++ )
    {
        face = this.geometry.faces[ i ];
        numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
        for( j = 0; j < numberOfSides; j++ )
        {
            vertexIndex = face[ faceIndices[ j ] ];
            point = this.geometry.vertices[ vertexIndex ];
            color = new THREE.Color( 0xffff33);
            color.setHSL( 0.9 * (zMax - point.z) / zRange, 1,0.5 );
            this.geometry.colors[vertexIndex] = color;
            face.vertexColors[ j ] = color;
        }
    }
    //this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();
    this.geometry.verticesNeedUpdate = true;
    //this.geometry.normalsNeedUpdate = true;
    //this.geometry.colorsNeedUpdate = true;
};
