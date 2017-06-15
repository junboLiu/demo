/**
 * Created by ljb on 2017/5/10.
 */

var VehicleLane = function (vertices,roadSegments,roadWidth) {

    this.particleGeometry = new THREE.SphereGeometry(3, 32, 32);
    this.particleMaterial = new THREE.MeshLambertMaterial({
        color: 0x88ffff
    });

    this.BBoxs = [];
    this.vertices = vertices;
    this.roadSegments = roadSegments;
    this.roadWidth = roadWidth;
    this.initBBox();
    this.particles = new THREE.Object3D();
    this.num_particles = 0;
    this.isParticleEnable = true;
    this.vehicles = new THREE.Object3D();
    this.num_vehicles = 0;
    this.isVehicleEnable = false;
    //this.arrows = new THREE.Object3D();
    //this.isArrowEnable = false;
    //this.blocks = new THREE.Object3D();
    //this.isBlockEnable = false;

    this.sph = new SPH();


};

VehicleLane.prototype = {

    initBBox: function () {

        for (var i = 0; i < this.roadSegments;i++) {
            var Box = new BBox();
            var vertice1 = new THREE.Vector3();
            var vertice2 = new THREE.Vector3();
            var vertice3 = new THREE.Vector3();
            var vertice4 = new THREE.Vector3();
            vertice1.copy(this.vertices[i]);
            vertice2.copy(this.vertices[i+1]);
            vertice3.copy(this.vertices[i+1+ (this.roadSegments + 1) * (this.roadWidth)]);
            vertice4.copy(this.vertices[i+ (this.roadSegments + 1) * (this.roadWidth)]);
            Box.point.push(vertice1);
            Box.point.push(vertice2);
            Box.point.push(vertice3);
            Box.point.push(vertice4);
            Box.tangent.subVectors(vertice2, vertice1).normalize();
            this.BBoxs.push(Box);
        }

    },

    addParticles:function () {
        var pos = [9,19,29,39];
        var position = new THREE.Vector3(0,0,0);
        var index = Math.floor(Math.random()*(3+1));
        position.copy(this.vertices[pos[index] * (this.roadSegments + 1)]);
        position.y += 4;
        var particle = new Particle(position, this.particleGeometry, this.particleMaterial);
        particle.parameters.tangent.copy(this.BBoxs[0].tangent);
        particle.parameters.index = this.num_particles;
        this.particles.add(particle);
        this.num_particles++;
        // for(var i = 0; i < 1; i++)
        // {
        //
        // }
    },

    updateParticles:function () {

        var particles = this.particles.children;
        this.sph.updateKDTree(particles);
        var particle;
        var newPoss = [];
        var isInField = true;
        var HorPos,verPos;

        for (var j = 0; j < this.num_particles; j++) {
            var newPos = new THREE.Vector3(0, 0, 0);
            var newVel = new THREE.Vector3(0, 0, 0);
            particle = particles[j];
            this.sph.calculateDensity(particle);
            this.sph.calculateForces(particle);
            newPos.subVectors(particle.parameters.externalForce, particle.parameters.pressureForce);
            newPos.add(particle.parameters.viscosityForce);
            newPos.multiplyScalar(this.sph.parameters.timeStep);
            newPos.add(particle.position);
            newPoss.push(newPos);
        }

        for (var i = 0; i < this.num_particles; i++) {
            particle = particles[i];
            HorPos = this.BBoxs[particle.parameters.bboxIndex].isOnLeft1(newPoss[i]);
            if(HorPos < 0){
                HorPos = this.BBoxs[particle.parameters.bboxIndex].isOnLeft2(newPoss[i]);
                if(HorPos < 0){
                    isInField = true;
                    verPos = this.BBoxs[particle.parameters.bboxIndex].isOnLeft3(newPoss[i]);
                    if(verPos <0){
                        verPos = this.BBoxs[particle.parameters.bboxIndex].isOnLeft4(newPoss[i]);
                        if(verPos === 0){
                            newPoss[i].z += 2;
                        }else if(verPos > 0){
                            newPoss[i].z = (this.BBoxs[particle.parameters.bboxIndex].point[0].z + this.BBoxs[particle.parameters.bboxIndex].point[1].z)/2 +2;
                        }
                    }else if(verPos === 0){
                        newPoss[i].z -= 2;
                    }else if(verPos > 0){
                        newPoss[i].z = (this.BBoxs[particle.parameters.bboxIndex].point[2].z + this.BBoxs[particle.parameters.bboxIndex].point[3].z)/2 -2;
                    }
                    newPoss[i].y = (this.BBoxs[particle.parameters.bboxIndex].point[0].y + this.BBoxs[particle.parameters.bboxIndex].point[1].y +
                        this.BBoxs[particle.parameters.bboxIndex].point[2].y + this.BBoxs[particle.parameters.bboxIndex].point[3].y)/4 +4;
                }
            }else if(HorPos === 0){
                isInField = true;
                if(particle.parameters.bboxIndex < this.BBoxs.length -2){
                    particle.parameters.tangent.copy(this.BBoxs[particle.parameters.bboxIndex+1].tangent);
                    particle.parameters.bboxIndex = particle.parameters.bboxIndex+1;
                }else {
                    particle.parameters.tangent.copy(this.BBoxs[particle.parameters.bboxIndex].tangent);
                }

                verPos = this.BBoxs[particle.parameters.bboxIndex+1].isOnLeft3(newPoss[i]);
                if(verPos <0){
                    verPos = this.BBoxs[particle.parameters.bboxIndex+1].isOnLeft4(newPoss[i]);
                    if(verPos === 0){
                        newPoss[i].z += 2;
                    }else if(verPos > 0){
                        newPoss[i].z = (this.BBoxs[particle.parameters.bboxIndex+1].point[0].z + this.BBoxs[particle.parameters.bboxIndex+1].point[1].z)/2 +2;
                    }
                }else if(verPos === 0){
                    newPoss[i].z -= 2;
                }else if(verPos > 0){
                    newPoss[i].z = (this.BBoxs[particle.parameters.bboxIndex+1].point[2].z + this.BBoxs[particle.parameters.bboxIndex+1].point[3].z)/2 -2;
                }
                newPoss[i].y = (this.BBoxs[particle.parameters.bboxIndex+1].point[0].y + this.BBoxs[particle.parameters.bboxIndex+1].point[1].y +
                    this.BBoxs[particle.parameters.bboxIndex+1].point[2].y + this.BBoxs[particle.parameters.bboxIndex+1].point[3].y)/4 +4;
            }else {
                for(var n = particle.parameters.bboxIndex+1, nl = this.BBoxs.length; n < nl; n++){
                    HorPos = this.BBoxs[n].isOnLeft1(newPoss[i]);
                    if(HorPos < 0){
                        isInField = true;
                        particle.parameters.tangent.copy(this.BBoxs[n].tangent);
                        particle.parameters.bboxIndex = n;
                        verPos = this.BBoxs[n].isOnLeft3(newPoss[i]);
                        if(verPos < 0){
                            verPos = this.BBoxs[n].isOnLeft4(newPoss[i]);
                            if(verPos === 0){
                                newPoss[i].z += 2;
                            }else if(verPos > 0){
                                newPoss[i].z = (this.BBoxs[n].point[0].z + this.BBoxs[n].point[1].z)/2 +2;
                            }
                        }else if(verPos === 0){
                            newPoss[i].z -= 2;
                        }else if(verPos > 0){
                            newPoss[i].z = (this.BBoxs[n].point[2].z + this.BBoxs[n].point[3].z)/2 -2;
                        }
                        newPoss[i].y = (this.BBoxs[n].point[0].y + this.BBoxs[n].point[1].y +
                            this.BBoxs[n].point[2].y + this.BBoxs[n].point[3].y)/4 +4;
                        break;
                    }else if(HorPos === 0){
                        isInField = true;
                        if(n < this.BBoxs.length -2){
                            particle.parameters.tangent.copy(this.BBoxs[n+1].tangent);
                            particle.parameters.bboxIndex = n+1;
                        }else {
                            particle.parameters.tangent.copy(this.BBoxs[n].tangent);
                            particle.parameters.bboxIndex = n;
                        }

                        verPos = this.BBoxs[n+1].isOnLeft3(newPoss[i]);
                        if(verPos <0){
                            verPos = this.BBoxs[n+1].isOnLeft4(newPoss[i]);
                            if(verPos === 0){
                                newPoss[i].z += 2;
                            }else if(verPos > 0){
                                newPoss[i].z = (this.BBoxs[n+1].point[0].z + this.BBoxs[n+1].point[1].z)/2 +2;
                            }
                        }else if(verPos === 0){
                            newPoss[i].z -= 2;
                        }else if(verPos > 0){
                            newPoss[i].z = (this.BBoxs[n+1].point[2].z + this.BBoxs[n+1].point[3].z)/2 -2;
                        }
                        newPoss[i].y = (this.BBoxs[n+1].point[0].y + this.BBoxs[n+1].point[1].y +
                            this.BBoxs[n+1].point[2].y + this.BBoxs[n+1].point[3].y)/4 +4;
                        break;
                    }
                }
            }
            if(this.BBoxs[this.BBoxs.length-1].isOnLeft1(newPoss[i]) >= 0){
                isInField = false;
            }
            if(!isInField){
                particles.splice(i,1);
                newPoss.splice(i,1);
                i--;
                this.num_particles--;
            }else {
                newVel.subVectors(newPoss[i], particle.position);
                particle.position.copy(newPoss[i]);
                particle.parameters.vel.set(newVel.x, newVel.y, newVel.z);
            }

        }

        this.addParticles();
    },

    clearAllParticles:function () {



    },

    addVehicles:function () {


    },

    updateVehicles:function () {

    },

    clearAllVehicles:function () {



    }

};
