var x1 >= 0;
var x2 >= 0;
var x3 >= 0;
var y1 >= 0, <=1, integer;
var y2 binary;
var y3 binary;

maximize z: 6*x1 + 4*x2 + 7*x3 - 200*y1 - 150*y2 - 100*y3;

labor: 3*x1 + 2*x2 + 6*x3 <= 180;
cloth: 4*x1 + 3*x2 + 4*x3 <= 160;

M1: x1 <= 40*y1;
M2: x2 <= 53*y2;
M3: x3 <= 30*y3;