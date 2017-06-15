/**
 * Created by ljb on 2017/6/15.
 */

ToolBar.Video = function (handler) {

    var signals = handler.signals;
    var hostPath = window.location.href.replace("index.html","");

    var container = new UI.Panel();
    container.setId( 'ToolBarVideo' );

    var videoButton = new UI.Button( 'Help' );
    videoButton.dom.title = 'Help';
    videoButton.onClick( function () {
        $(document).ready(function(){
            $('.popup').popup({
                close: function(){
                    $(this).find('.embed-container').empty();
                }
            });

                var plugin = $('#popup-video.popup').data('popup');

                $('#popup-video.popup .embed-container').html(
                    '<iframe src="'+hostPath +'video/Video_player.html" frameborder="0" allowfullscreen />'
                );

                plugin.open();

        });
    } );
    container.add( videoButton );

    return container;
};
