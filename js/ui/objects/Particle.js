/**
 * Created by ljb on 2017/5/10.
 */

var Particle = function (position,geometry,material) {

    THREE.Mesh.call(this,geometry,material);

    this.parameters = {
        neighbors:[],
        vel: new THREE.Vector3(0, 0, 0),
        density: 0,
        viscosityForce: new THREE.Vector3(0, 0, 0),
        pressureForce: new THREE.Vector3(0, 0, 0),
        tangent:new THREE.Vector3(0, 0, 0),
        externalForce: new THREE.Vector3(0, 0, 0),
        bboxIndex:0
    };
    this.position.set(position.x,position.y,position.z);

    return this;

};

Particle.prototype = Object.assign(Object.create( THREE.Mesh.prototype ));
Particle.prototype.constructor = Particle;

Particle.prototype.setColor = function (color) {

    this.material.color.copy(color);
    this.material.needsUpdate = true;

};
