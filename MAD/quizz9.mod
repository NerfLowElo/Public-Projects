var x1 >= 0;
var x2 >= 0;
var x3 >= 0;
var x4 >= 0;
var x5 >= 0;
var x6 >= 0;
var x7 >= 0;
var x8 >= 0;

var RA >= 0;
var RB >= 0;
var RC >= 0;
var RD >= 0;
var RE >= 0;
var RF >= 0;
var RG >= 0;

minimize z: RA*100 + RB*80 + RC*60 + RD*70 + RE*30 + RF*20 + RG*50;

C0: x8 - x1 <= 40;
C1: x2 >= x1 + 3 - RA;
C2: x3 >= x2 + 6 - RB;
C3: x4 >= x2 + 14 - RC;
C4: x5 >= x4 + 8 - RD;
C5: x6 >= x5 + 4 - RE;
C6: x6 >= x3;
C7: x7 >= x6 + 8 - RF;
C8: x8 >= x7 + 9 - RG;

C9: RA <= 3;
C10: RB <= 4;
C11: RC <= 5;
C12: RD <= 2;
C13: RE <= 4;
C14: RF <= 4;
C15: RG <= 4;