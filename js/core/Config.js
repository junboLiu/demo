/**
 * Created by ljb on 2017/4/30.
 */

var Config = function ( name ) {

    var storage = {

        'autosave': true,
        'project/renderer': 'WebGLRenderer',
        'project/renderer/antialias': true,

    };

    //
    if ( window.localStorage[ name ] === undefined ) {

        window.localStorage[ name ] = JSON.stringify( storage );

    } else {

        var data = JSON.parse( window.localStorage[ name ] );

        for ( var key in data ) {

            storage[ key ] = data[ key ];

        }

    }

    return {

        getKey: function ( key ) {

            return storage[ key ];

        },

        //param: key value key value......
        setKey: function () {

            for ( var i = 0, l = arguments.length; i < l; i += 2 ) {

                storage[ arguments[ i ] ] = arguments[ i + 1 ];

            }

            window.localStorage[ name ] = JSON.stringify( storage );

            console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved config to LocalStorage.' );

        },

        clear: function () {

            delete window.localStorage[ name ];

        }

    };

};

