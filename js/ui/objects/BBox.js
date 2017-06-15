/**
 * Created by ljb on 2017/5/11.
 */

var BBox = function (){
    this.point = [];
    this.tangent = new THREE.Vector3(0,0,0);

    return this;
};

BBox.prototype.constructor = BBox;

BBox.prototype.isOnLeft1 = function (pos) {

    var vec1 = new THREE.Vector3();
    var vec2 = new THREE.Vector3();
    vec1.subVectors(this.point[1],this.point[2]);
    vec2.subVectors(pos,this.point[2]);
    var cross = vec1.x * vec2.z - vec1.z * vec2.x;
    if(cross < 0){
        return -1;
    }else if(cross === 0){
        return 0;
    }else {
        return 1;
    }
};
BBox.prototype.isOnLeft2 = function (pos) {
    var vec1 = new THREE.Vector3();
    var vec2 = new THREE.Vector3();
    vec1.subVectors(this.point[3],this.point[0]);
    vec2.subVectors(pos,this.point[0]);
    var cross = vec1.x * vec2.z - vec1.z * vec2.x;
    if(cross < 0){
        return -1;
    }else if(cross === 0){
        return 0;
    }else {
        return 1;
    }
};
BBox.prototype.isOnLeft3 = function (pos) {
    var vec1 = new THREE.Vector3();
    var vec2 = new THREE.Vector3();
    vec1.subVectors(this.point[2],this.point[3]);
    vec2.subVectors(pos,this.point[3]);
    var cross = vec1.x * vec2.z - vec1.z * vec2.x;
    if(cross < 0){
        return -1;
    }else if(cross === 0){
        return 0;
    }else {
        return 1;
    }
};
BBox.prototype.isOnLeft4 = function (pos) {
    var vec1 = new THREE.Vector3();
    var vec2 = new THREE.Vector3();
    vec1.subVectors(this.point[0],this.point[1]);
    vec2.subVectors(pos,this.point[1]);
    var cross = vec1.x * vec2.z - vec1.z * vec2.x;
    if(cross < 0){
        return -1;
    }else if(cross === 0){
        return 0;
    }else {
        return 1;
    }
};

