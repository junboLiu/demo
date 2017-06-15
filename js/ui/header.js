/**
 * Created by ljb on 2017/4/30.
 */

var header = function () {

    UI.Element.call( this );

    var dom = document.createElement('div');
    dom.className = 'header' ;

    var div = document.createElement('div');
    div.id = 'logo';
    dom.appendChild(div);

    var h1 = document.createElement('h1');
    div.appendChild(h1);

    var a = document.createElement('a');
    a.id = 'logo-text';
    a.href = '';
    a.title = 'Demo: Tranffic Flow Simulator System';
    a.target = '_self';
    a.textContent = 'Demo: Tranffic Flow Simulator System';
    h1.appendChild(a);

    var divideLine = document.createElement('div');
    divideLine.className = 'divideLine';
    dom.appendChild(divideLine);

    var colorBar = document.createElement('div');
    colorBar.id = 'colorBar';
    divideLine.appendChild(colorBar);

    this.dom = dom;
    return this;
};
