/**
 * Created by ljb on 2017/4/30.
 */

var footer = function () {

    UI.Element.call( this );

    var dom = document.createElement('div');
    dom.className = 'footer' ;

    var divideLine = document.createElement('div');
    divideLine.className = 'divideLine';
    dom.appendChild(divideLine);

    var colorBar = document.createElement('div');
    colorBar.id = 'colorBar';
    divideLine.appendChild(colorBar);

    var footerText = document.createElement('div');
    footerText.id = 'footerText';
    dom.appendChild(footerText);

    var text = document.createElement('p');
    text.align = 'center';
    text.textContent = '@2017 LiuJunbo 14112075@bjtu.edu.cn';
    footerText.appendChild(text);

    this.dom = dom;

    return this;
};
