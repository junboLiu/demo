/**
 * Created by ljb on 2017/4/30.
 */

var Command = function ( handler ) {

    this.id = - 1;
    this.inMemory = false;
    this.updatable = false;
    this.type = '';
    this.name = '';

    if ( handler !== undefined ) {

        Command.handler = handler;

    }
    this.handler = Command.handler;

};

Command.prototype.toJSON = function () {

    var output = {};
    output.type = this.type;
    output.id = this.id;
    output.name = this.name;
    return output;

};

Command.prototype.fromJSON = function ( json ) {

    this.inMemory = true;
    this.type = json.type;
    this.id = json.id;
    this.name = json.name;

};
