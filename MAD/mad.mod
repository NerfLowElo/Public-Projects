var xp1 <= 20;
var xp2 <= 40;
var xp3 <= 60;

var xm1 <= 80;
var xm2 <= 60;
var xm3 <= 70;

var xr1 <= 20;
var xr2 <= 20;
var xr3 <= 30;

maximize receita: xp1*100 + xp2*90 + xp3*80 + xm1*215 + xm2*185 + xm3*145 + xr1*140 + xr2*120 + xr3*100;

R1: xp1 + xp2 + xp3 + xm1 + xm2 + xm3 <= 300;
R2: xm1 + xm2 + xm3 + xr1 + xr2 + xr3 <= 200;
R3: xp1 >= 0; 
R4: xp2 >= 0;
R5: xp3 >= 0;
R6: xm1 >= 0;
R7: xm2 >= 0;
R8: xm3 >= 0;
R9: xr1 >= 0;
R10: xr2 >= 0;
R11: xr3 >= 0;

