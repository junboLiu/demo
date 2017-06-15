/**
 * Created by ljb on 2017/4/30.
 */

ToolBar.AutoSave = function (handler) {

    var container = new UI.Panel();
    container.setId( 'ToolBarAutoSave' );

    var autoSaveCheck = new UI.THREE.Boolean( handler.config.getKey( 'autosave' ), 'autosave' );
    autoSaveCheck.onChange( function () {

        var value = this.getValue();

        handler.config.setKey( 'autosave', value );

        if ( value === true ) {

            handler.signals.sceneGraphChanged.dispatch();

        }

    } );
    container.add( autoSaveCheck );

    handler.signals.savingStarted.add( function () {

        autoSaveCheck.text.setTextDecoration( 'underline' );

    } );

    handler.signals.savingFinished.add( function () {

        autoSaveCheck.text.setTextDecoration( 'none' );

    } );

    return container;

};
