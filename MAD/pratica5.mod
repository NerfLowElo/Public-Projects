var x1 >= 0;
var x2 >= 0;
var x3 >= 0;
var x4 >= 0;
var x5 >= 0;
var x6 >= 0;

minimize z: x6 - x1;

R1: x2 >= x1 + 6;
R2: x3 >= x1 + 9;
R3: x5 >= x3 + 8;
R4: x4 >= x3 + 7;
R5: x5 >= x4 + 10;
R6: x6 >= x5 + 12;
R7: x3 >= x2;
 