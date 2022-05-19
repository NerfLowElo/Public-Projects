var x1 >= 0;
var x2 >= 0;
var x3 >= 0;

var y1 >=0;
var y2 >=0;
var y3 >=0;

minimize z: y1*100000 + y2*60000 + y3*40000 + x1*20 + x2*30 + x3*40;

R1: 0.40*x1 + 0.25*x2 + 0.20*x3 >= 80000;
R2: 0.30*x1 + 0.20*x2 + 0.25*x3 >= 50000;

M1: x1 <= 200000*y1;
M2: x2 <= 320000*y2;
M3: x3 <= 400000*y3;

M4: y1 <= 1;
M5: y2 <= 1;
M6: y3 <= 1;
