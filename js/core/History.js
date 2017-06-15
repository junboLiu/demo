/**
 * Created by ljb on 2017/5/1.
 */

History = function ( handler ) {

    this.handler = handler;
    this.undos = [];
    this.redos = [];
    this.lastCmdTime = new Date();
    this.idCounter = 0;

    this.historyDisabled = false;
    this.config = handler.config;

    Command( handler );

    var scope = this;

    //history disabled when startPlayer
    this.handler.signals.startPlay.add( function () {

        scope.historyDisabled = true;

    } );

    //history enabled when stopPlayer
    this.handler.signals.stopPlay.add( function () {

        scope.historyDisabled = false;

    } );

};

History.prototype = {

    // execute cmd
    execute: function ( cmd, optionalName ) {

        var lastCmd = this.undos[ this.undos.length - 1 ];
        var timeDifference = new Date().getTime() - this.lastCmdTime.getTime();

        var isUpdatableCmd = lastCmd &&
            lastCmd.updatable &&
            cmd.updatable &&
            lastCmd.object === cmd.object &&
            lastCmd.type === cmd.type &&
            lastCmd.attributeName === cmd.attributeName;

        if ( isUpdatableCmd && timeDifference < 500 ) {

            lastCmd.update( cmd );
            cmd = lastCmd;

        } else {

            this.undos.push( cmd );
            cmd.id = ++ this.idCounter;

        }
        cmd.name = ( optionalName !== undefined ) ? optionalName : cmd.name;
        cmd.execute();
        cmd.inMemory = true;
        cmd.json = cmd.toJSON();

        this.lastCmdTime = new Date();

        this.redos = [];

    },

    undo: function () {

        if ( this.historyDisabled ) {

            alert( "Undo/Redo disabled when playing." );
            return;

        }

        var cmd = undefined;

        if ( this.undos.length > 0 ) {

            cmd = this.undos.pop();

            if ( cmd.inMemory === false ) {

                cmd.fromJSON( cmd.json );

            }

        }

        if ( cmd !== undefined ) {

            cmd.undo();
            this.redos.push( cmd );

        }

        return cmd;

    },

    redo: function () {

        if ( this.historyDisabled ) {

            alert( "Undo/Redo disabled when playing." );
            return;

        }

        var cmd = undefined;

        if ( this.redos.length > 0 ) {

            cmd = this.redos.pop();

            if ( cmd.inMemory === false ) {

                cmd.fromJSON( cmd.json );

            }

        }

        if ( cmd !== undefined ) {

            cmd.execute();
            this.undos.push( cmd );

        }

        return cmd;

    },

    toJSON: function () {

        var history = {};
        history.undos = [];
        history.redos = [];


        for ( var i = 0 ; i < this.undos.length; i ++ ) {

            if ( this.undos[ i ].hasOwnProperty( "json" ) ) {

                history.undos.push( this.undos[ i ].json );

            }

        }


        for ( var i = 0 ; i < this.redos.length; i ++ ) {

            if ( this.redos[ i ].hasOwnProperty( "json" ) ) {

                history.redos.push( this.redos[ i ].json );

            }

        }

        return history;

    },

    fromJSON: function ( json ) {

        if ( json === undefined ) return;

        for ( var i = 0; i < json.undos.length; i ++ ) {

            var cmdJSON = json.undos[ i ];
            var cmd = new window[ cmdJSON.type ]();
            cmd.json = cmdJSON;
            cmd.id = cmdJSON.id;
            cmd.name = cmdJSON.name;
            this.undos.push( cmd );
            this.idCounter = ( cmdJSON.id > this.idCounter ) ? cmdJSON.id : this.idCounter;

        }

        for ( var i = 0; i < json.redos.length; i ++ ) {

            var cmdJSON = json.redos[ i ];
            var cmd = new window[ cmdJSON.type ]();
            cmd.json = cmdJSON;
            cmd.id = cmdJSON.id;
            cmd.name = cmdJSON.name;
            this.redos.push( cmd );
            this.idCounter = ( cmdJSON.id > this.idCounter ) ? cmdJSON.id : this.idCounter;

        }

    },

    clear: function () {

        this.undos = [];
        this.redos = [];
        this.idCounter = 0;

    },

    goToState: function ( id ) {

        if ( this.historyDisabled ) {

            alert( "Undo/Redo disabled when playing." );
            return;

        }

        this.handler.signals.sceneGraphChanged.active = false;

        var cmd = this.undos.length > 0 ? this.undos[ this.undos.length - 1 ] : undefined;

        if ( cmd === undefined || id > cmd.id ) {

            cmd = this.redo();
            while ( cmd !== undefined && id > cmd.id ) {

                cmd = this.redo();

            }

        } else {

            while ( true ) {

                cmd = this.undos[ this.undos.length - 1 ];

                if ( cmd === undefined || id === cmd.id ) break;

                cmd = this.undo();

            }

        }

        this.handler.signals.sceneGraphChanged.active = true;
        this.handler.signals.sceneGraphChanged.dispatch();

    },

    enableSerialization: function ( id ) {

        this.goToState( - 1 );

        this.handler.signals.sceneGraphChanged.active = false;

        var cmd = this.redo();
        while ( cmd !== undefined ) {

            if ( ! cmd.hasOwnProperty( "json" ) ) {

                cmd.json = cmd.toJSON();

            }
            cmd = this.redo();

        }

        this.handler.signals.sceneGraphChanged.active = true;

        this.goToState( id );

    }

};
