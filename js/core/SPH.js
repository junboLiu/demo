/**
 * Created by ljb on 2017/5/11.
 * Smoothed Particle Hydrodynamics
 */

function SPH () {

    if( SPH.unique !== undefined ){
        return SPH.unique;
    }
    SPH.unique = this;
    var self = this;

    this.kdTree = new KDTree();
    this.parameters = {
        gamma: 2.0,
        timeStep: 0.025,
        supportRadius: 16,
        particleMass: 40.0,
        pressureCoefficient: 6.0,
        viscousityCoefficient: 10000.0,
        dampingFactor: 2.0,
        externalAcceleration: 300.0
    };

    this.updateKDTree = function (particles) {

        this.kdTree.createTree(particles);
        for(var i = 0, il = particles.length; i < il; i++){
            particles[i].parameters.neighbors = this.kdTree.nearest(particles[i].position,this.parameters.supportRadius);
        }

    };

    this.poly6 = function (pos1,pos2) {
        var diffVec = new THREE.Vector3(0,0,0);
        diffVec.subVectors(pos2, pos1);
        var absDiffVec = diffVec.length();
        if(absDiffVec > self.parameters.supportRadius){
            return 0;
        }

        return 35 / (32 * Math.pow(self.parameters.supportRadius, 7.0)) * Math.pow((Math.pow(self.parameters.supportRadius, 2.0) - Math.pow(absDiffVec, 2)), 3.0);

    };

    function spiky (particle,neighbor) {
        var diffVec = new THREE.Vector3(0, 0, 0);
        diffVec.subVectors(neighbor.position, particle.position);
        var absDiffVec = diffVec.length();
        if(absDiffVec === 0 || neighbor.position.x < particle.position.x || absDiffVec > self.parameters.supportRadius){

            return new THREE.Vector3(0,0,0);
        }

        var const_pressure = -(6 / Math.pow(self.parameters.supportRadius, 4.0)) * (Math.pow(self.parameters.supportRadius - absDiffVec, 2.0)) / absDiffVec;

        var pressure_gradient =  new THREE.Vector3(const_pressure * diffVec.x, const_pressure * diffVec.y, const_pressure * diffVec.z);
        pressure_gradient.multiplyScalar((self.parameters.particleMass *(Math.pow(particle.parameters.density,self.parameters.gamma)+Math.pow(neighbor.parameters.density,self.parameters.gamma))) / (2 * neighbor.parameters.density));
        return pressure_gradient;
    }

    function viscosity(particle,neighbor) {
        var diffVec = new THREE.Vector3(0, 0, 0);
        diffVec.subVectors(neighbor.position, particle.position);
        var absDiffVec = diffVec.length();
        if(absDiffVec === 0 || neighbor.position.x < particle.position.x || absDiffVec > self.parameters.supportRadius){

            return new THREE.Vector3(0,0,0);
        }

        var diffVel = new THREE.Vector3(0, 0, 0);
        diffVel.subVectors(neighbor.parameters.vel,particle.parameters.vel);
        var viscosity_gradient =  (12 / Math.pow(self.parameters.supportRadius, 4.0)) * (self.parameters.supportRadius - absDiffVec);
        diffVel.divideScalar(neighbor.parameters.density).multiplyScalar(self.parameters.particleMass * viscosity_gradient);
        return diffVel;
    }

    this.calculateDensity = function (particle) {
        var densitySum = 0;
        for (var j = 0, jl = particle.parameters.neighbors.length; j < jl; j++) {
            if (particle.parameters.neighbors[j] !== undefined) {
                densitySum += this.poly6(particle.position, particle.parameters.neighbors[j].position);
            }
        }
        densitySum *= this.parameters.particleMass;
        particle.parameters.density = densitySum;
    };

    this.calculateForces = function (particle) {
        var externalForce = new THREE.Vector3(0, 0, 0);
        var currentVel = new THREE.Vector3(0, 0, 0);
        currentVel.copy(particle.parameters.vel);
        var external = self.parameters.externalAcceleration - self.parameters.dampingFactor * currentVel.length();
        externalForce.copy(particle.parameters.tangent);
        externalForce.multiplyScalar(particle.parameters.density * external);
        particle.parameters.externalForce.set(externalForce.x, externalForce.y, externalForce.z);

        var pressureForce = new THREE.Vector3(0, 0, 0);
        var viscosityForce = new THREE.Vector3(0, 0, 0);
        for (var j = 0, jl = particle.parameters.neighbors.length; j < jl; j++) {
            if (particle.parameters.neighbors[j] !== undefined) {
                pressureForce.add(spiky(particle, particle.parameters.neighbors[j]));
                viscosityForce.add(viscosity(particle, particle.parameters.neighbors[j]));
            }
        }
        pressureForce.multiplyScalar(-1 * self.parameters.pressureCoefficient);
        viscosityForce.multiplyScalar(self.parameters.viscousityCoefficient);
        particle.parameters.pressureForce.set(pressureForce.x, pressureForce.y, pressureForce.z);
        particle.parameters.viscosityForce.set(viscosityForce.x, viscosityForce.y, viscosityForce.z);
    };

}



