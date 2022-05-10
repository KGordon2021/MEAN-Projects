
var circleOp;
var userIn;
var userIn2;

function calculate3(){
    var retval
    userIn = parseFloat(document.getElementById("userInput").value);
    userIn2 = parseFloat(document.getElementById("userInput2").value);
    circleOp = document.getElementById("circleOps").value;
    retval = docalculation(userIn, circleOp);
    document.getElementById("results").innerHTML = "The result is = " + retval;
}

function docalculation(userIn, operation='circle') {

var results = 0;
var pi = 3.14;

var operand = operation;
switch (operand) {
    case 'circ':
        results = 2 * pi * userIn;
        break;
    case 'area':
        results = pi * (userIn * userIn);
        break;
    case 'dia':
        results = userIn * 2;
        break;
    case 'rad':
        results = userIn / 2;
        break;
    case 'rect':
        results = userIn * userIn2;
        break;
    default: 
    results = userIn + 0;
        break;

}
return results;
}

function selected(oObject) {
    var selectedValue = oObject.options[oObject.selectedIndex].value;
    var userInput2 = document.getElementById('userInput2');

    userInput2.disabled = false; // false by default

    if (selectedValue == 'rect') {
        userInput2.disabled = false;
    }else {
        userInput2.disabled = true;
    }
}


// for caluclating basic math section



function calculate2(){
    var second ;
    var first ;
    var sign ;
    var retvals
        second = parseFloat(document.getElementById("second").value);
        first = parseFloat(document.getElementById("first").value);
        sign = document.getElementById("sign").value;
        retvals = docalculation(first,second,sign);
        document.getElementById("output").innerHTML = retvals;
    }
function docalculation(val1,val2,operator='+') {

var result = 0;
// var operand = document.getElementById("sign").value;
var operandi = operator;
switch (operandi) {
    case '*':
        result = val1 * val2;
        break;
    case '-':
        result = val1 - val2;
        break;
    case '+':
        result = val1 + val2;
        break;
    case '/':
        result = val1 / val2;
        break;

    default: 
    result = val1 + val2;
        break;

}
return result;
}