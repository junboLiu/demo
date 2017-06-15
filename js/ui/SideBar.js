/**
 * Created by ljb on 2017/4/30.
 */

var SideBar = function ( handler ) {

    var container = new UI.Panel();
    container.setId( 'SideBar' );

    var densityTab = new UI.Text( 'Density / Velocity' ).onClick( onClick );
    var obsevationsTab = new UI.Text( 'Obsevations' ).onClick( onClick );
    var parametersTab = new UI.Text( 'Parameters' ).onClick( onClick );
    var interactionTab = new UI.Text( 'Interaction' ).onClick( onClick );

    var tabs = new UI.Div();
    tabs.setId( 'tabs' );
    tabs.add( densityTab, obsevationsTab, parametersTab, interactionTab);
    container.add( tabs );

    function onClick( event ) {

        select( event.target.textContent );

    }

    var density = new UI.Span().add(
        new UI.Text('1')
    );
    container.add( density );

    var obsevations = new UI.Span().add(
        new UI.Text('2')
    );
    container.add( obsevations );

    var parameters = new UI.Span().add(
        new UI.Text('3')
    );
    container.add( parameters );

    var interaction = new UI.Span().add(
        new SideBar.Interaction(handler)
    );
    container.add( interaction );


    function select( section ) {

        densityTab.setClass( '' );
        obsevationsTab.setClass( '' );
        parametersTab.setClass( '' );
        interactionTab.setClass( '' );

        density.setDisplay( 'none' );
        obsevations.setDisplay( 'none' );
        parameters.setDisplay( 'none' );
        interaction.setDisplay( 'none' );

        switch ( section ) {
            case 'Density / Velocity':
                densityTab.setClass( 'selected' );
                density.setDisplay( '' );
                break;
            case 'Obsevations':
                obsevationsTab.setClass( 'selected' );
                obsevations.setDisplay( '' );
                break;
            case 'Parameters':
                parametersTab.setClass( 'selected' );
                parameters.setDisplay( '' );
                break;
            case 'Interaction':
                interactionTab.setClass( 'selected' );
                interaction.setDisplay( '' );
                break;
        }

    }

    select( 'Interaction' );

    return container;

};
