/**
 * Created by ljb on 17-5-2.
 */

SideBar.Interaction = function (handler) {

    var container = new UI.Panel();

    //MainViewer
    var MainViewer = new UI.Panel();

    var titleRow = new UI.Row();
    var title_MainViewer = new UI.Text('MainViewer');
    title_MainViewer.dom.style = 'font-weight:bold; font-size:15px';
    titleRow.add( title_MainViewer );
    MainViewer.add(titleRow);

    var subRow1 = new UI.Row();
    var checkBox_Density = new UI.Checkbox().onChange( update );
    subRow1.add( checkBox_Density );
    subRow1.add( new UI.Text('Density').setWidth('100px'));
    var checkBox_Velocity = new UI.Checkbox().onChange( update );
    subRow1.add( checkBox_Velocity );
    subRow1.add( new UI.Text('Velocity').setWidth('100px'));
    var checkBox_None1 = new UI.Checkbox().onChange( update );
    subRow1.add( checkBox_None1 );
    subRow1.add( new UI.Text('None').setWidth('100px'));
    MainViewer.add(subRow1);

    var subRow2 = new UI.Row();
    var checkBox_Particles = new UI.Checkbox().onChange( update );
    subRow2.add( checkBox_Particles );
    subRow2.add( new UI.Text('Particles').setWidth('100px'));
    var checkBox_Vehicles = new UI.Checkbox().onChange( update );
    subRow2.add( checkBox_Vehicles );
    subRow2.add( new UI.Text('Vehicles').setWidth('100px'));
    var checkBox_None2 = new UI.Checkbox().onChange( update );
    subRow2.add( checkBox_None2 );
    subRow2.add( new UI.Text('None').setWidth('100px'));
    var checkBox_Bbox = new UI.Checkbox().onChange( update );
    subRow2.add( checkBox_Bbox );
    subRow2.add( new UI.Text('Bbox').setWidth('50px'));
    MainViewer.add(subRow2);

    var subRow3 = new UI.Row();
    var checkBox_RoadSensors = new UI.Checkbox().onChange( update );
    subRow3.add( checkBox_RoadSensors );
    subRow3.add( new UI.Text('Road Sensors').setWidth('100px'));
    var checkBox_BoundaryCells = new UI.Checkbox().onChange( update );
    subRow3.add( checkBox_BoundaryCells );
    subRow3.add( new UI.Text('Boundary Cells').setWidth('100px'));
    var checkBox_ReferencePlanes = new UI.Checkbox().onChange( update );
    subRow3.add( checkBox_ReferencePlanes );
    subRow3.add( new UI.Text('Reference Planes').setWidth('120px'));
    MainViewer.add(subRow3);


    var subRow4 = new UI.Row();
    var checkBox_VehicleForce = new UI.Checkbox().onChange( update );
    subRow4.add( checkBox_VehicleForce );
    subRow4.add( new UI.Text('Vehicle Force').setWidth('100px'));
    var checkBox_VehicleVelocity = new UI.Checkbox().onChange( update );
    subRow4.add( checkBox_VehicleVelocity );
    subRow4.add( new UI.Text('Vehicle Velocity').setWidth('100px'));
    var checkBox_VehicleTrajectory = new UI.Checkbox().onChange( update );
    subRow4.add( checkBox_VehicleTrajectory );
    subRow4.add( new UI.Text('Vehicle Trajectory').setWidth('120px'));
    MainViewer.add(subRow4);

    var subRow5 = new UI.Row();
    var checkBox_VehicleTail = new UI.Checkbox().onChange( update );
    subRow5.add( checkBox_VehicleTail );
    subRow5.add( new UI.Text('Vehicle Tail').setWidth('100px'));
    MainViewer.add(subRow5);

    var subRow6 = new UI.Row();
    var checkBox_ParticleForce = new UI.Checkbox().onChange( update );
    subRow6.add( checkBox_ParticleForce );
    subRow6.add( new UI.Text('Particle Force').setWidth('100px'));
    var checkBox_ParticleVelocity = new UI.Checkbox().onChange( update );
    subRow6.add( checkBox_ParticleVelocity );
    subRow6.add( new UI.Text('Particle Velocity').setWidth('100px'));
    var checkBox_ParticleNormTangent = new UI.Checkbox().onChange( update );
    subRow6.add( checkBox_ParticleNormTangent );
    subRow6.add( new UI.Text('Particle Norm/Tangent').setWidth('150px'));
    MainViewer.add(subRow6);

    container.add(MainViewer);



    function update() {}










    return container;

};
