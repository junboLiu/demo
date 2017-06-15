/**
 * Created by ljb on 2017/4/30.
 */

var ToolBar = function ( handler ) {
    var container = new UI.Panel();
    container.setId( 'ToolBar' );

    //container.add(new ToolBar.File(handler));
    //container.add(new ToolBar.Edit(handler));
    container.add(new ToolBar.Play(handler));
    container.add(new ToolBar.Video(handler));
    //container.add(new ToolBar.AutoSave(handler));

    return container;

};

