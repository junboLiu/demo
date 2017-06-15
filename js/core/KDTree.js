/**
 * Created by ljb on 2017/5/15.
 */

function Node(particle,dim, parentNode) {
    this.particle = particle;
    this.leftNode = undefined;
    this.rightNode = undefined;
    this.parentNode = parentNode;
    this.dim = dim;
}

function KDTree() {

    if( KDTree.unique !== undefined ){
        return KDTree.unique;
    }
    KDTree.unique = this;

    this.root = undefined;

    function buildTree(particles,depth, parentNode) {
        var median,node;
        var dim = depth%3;

        if (particles.length === 0) {
            return;
        }
        if (particles.length === 1) {
            return new Node(particles[0], parentNode);
        }

        particles.sort(function (a,b) {

            if(dim === 0){
                return a.position.x - b.position.x;
            }else if(dim === 1){
                return a.position.y - b.position.y;
            }else if(dim === 2){
                return a.position.z - b.position.z;
            }

        });

        median = Math.floor(particles.length / 2);
        node = new Node(particles[median],dim, parentNode);
        node.leftNode = buildTree(particles.slice(0, median),depth+1, node);
        node.rightNode = buildTree(particles.slice(median + 1),depth+1, node);

        return node;
    }

    this.createTree = function (particles) {
        var particleArray = particles.concat();
        this.root = buildTree(particleArray,0);
    };

    this.nearest = function (position, maxDistance) {
        var result = [];

        function nearestSearch(node) {
            var distanceVec = new THREE.Vector3(0,0,0);
            distanceVec.subVectors(position,node.particle.position);
            var bestChild,
                otherChild,
                dim = node.dim,
                linearPoint = new THREE.Vector3(),
                linearDistanceVec = new THREE.Vector3(),
                linearDistance,
                i,
                ownDistance = distanceVec.length();

            if (node.rightNode === undefined && node.leftNode === undefined) {
                if(ownDistance <= maxDistance){
                    result.push(node.particle);
                }
                return;
            }

            for (i = 0; i < 3; i++) {
                if (i === dim) {
                    if(i === 0){
                        linearPoint.x = position.x;
                    }else if(i ===1){
                        linearPoint.y = position.y;
                    }else if(i === 2){
                        linearPoint.z = position.z;
                    }
                } else {
                    if(i === 0){
                        linearPoint.x = node.particle.position.x;
                    }else if(i ===1){
                        linearPoint.y = node.particle.position.y;
                    }else if(i === 2){
                        linearPoint.z = node.particle.position.z;
                    }
                }
            }
            linearDistanceVec.subVectors(linearPoint,node.particle.position);
            linearDistance = linearDistanceVec.length();

            if (node.rightNode === undefined) {
                bestChild = node.leftNode;
            } else if (node.leftNode === undefined) {
                bestChild = node.rightNode;
            } else {
                if(dim === 0){
                    if (position.x <= node.particle.position.x) {
                        bestChild = node.leftNode;
                    } else {
                        bestChild = node.rightNode;
                    }
                }else if(dim ===1){
                    if (position.y <= node.particle.position.y) {
                        bestChild = node.leftNode;
                    } else {
                        bestChild = node.rightNode;
                    }
                }else if(dim === 2){
                    if (position.z <= node.particle.position.z) {
                        bestChild = node.leftNode;
                    } else {
                        bestChild = node.rightNode;
                    }
                }
            }
            nearestSearch(bestChild);

            if(ownDistance <= maxDistance){
                result.push(node.particle);
            }

            if (linearDistance <= maxDistance) {
                if (bestChild === node.leftNode) {
                    otherChild = node.rightNode;
                } else {
                    otherChild = node.leftNode;
                }
                if (otherChild !== undefined) {
                    nearestSearch(otherChild);
                }
            }
        }

        if(this.root !== undefined) nearestSearch(this.root);

        return result;
    };

}



