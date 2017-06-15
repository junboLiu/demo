/**
 * Created by ljb on 2017/4/30.
 */

ToolBar.Play = function (handler) {

    var signals = handler.signals;

    var container = new UI.Panel();
    container.setId( 'ToolBarPlay' );

    //play or stop
    var isPlaying = false;
    var playButton = new UI.Button( 'Play' );
    playButton.dom.title = 'Play';
    playButton.onClick( function () {

        if(isPlaying === false)
        {
            isPlaying = true;
            playButton.setTextContent('Stop');
            playButton.dom.title = 'Stop';
            signals.startPlay.dispatch();

        } else {
            isPlaying = false;
            playButton.setTextContent('Play');
            playButton.dom.title = 'Play';
            signals.stopPlay.dispatch();
        }

    } );
    container.add( playButton );

    /* waitting */


    return container;
};
