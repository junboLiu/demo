/**
 * Created by ljb on 2017/4/30.
 */

ToolBar.Edit = function (handler) {

    var container = new UI.Panel();
    container.setId( 'ToolBarEdit' );

    // undo / redo / clear History /delete

    var undoButton = new UI.Button( 'Undo' );
    undoButton.dom.title = 'Undo (Ctrl+Z)';
    undoButton.onClick( function () {

        handler.undo();

    } );
    container.add( undoButton );

    var redoButton = new UI.Button( 'Redo' );
    redoButton.dom.title = 'Redo (Ctrl+Shift+Z)';
    redoButton.onClick( function () {

        handler.redo();

    } );
    container.add( redoButton );

    var clearButton = new UI.Button( 'Clear History' );
    clearButton.dom.title = 'Clear History';
    clearButton.onClick( function () {

        if ( confirm( 'The Undo/Redo History will be cleared. Are you sure?' ) ) {

            handler.history.clear();

        }

    } );
    container.add( clearButton );


    return container;
};
