var x1 >= 0;
var x2 >= 0;
var x3 >= 0;
var x4 >= 0;
var x5 >= 0;
var x6 >= 0;
var x7 >= 0;
var x8 >= 0;

minimize z: x8 - x1;

C1: x2 >= x1 + 3;
C2: x3 >= x2 + 6;
C3: x4 >= x2 + 14;
C4: x5 >= x4 + 8;
C5: x6 >= x5 + 4;
C6: x6 >= x3;
C7: x7 >= x6 + 8;
C8: x8 >= x7 + 9;
