   param Vr{1..12};
param Vc{1..12};
param Vi{1..12};

param MAr{1..12};
param MAc{1..12};
param MAi{1..12};

param MEr{1..12};
param MEc{1..12};
param MEi{1..12};

var x {j in 1..9, k in 1..12} >= 0;
var y {r in 1..9, j in 1..12} >= 0;
var z {r in 1..9, j in 1..11} >= 0;

maximize lucro: sum {k in 1..12, j in 1..11, r in 1..9}  (y[1,k]*Vr[k] + y[2,k]*Vc[k] + y[3,k]*Vi[k] + y[4,k]*MAr[k] + y[5,k]*MAc[k] + y[6,k]*MAi[k]  + y[7,k]*MEr[k] + y[8,k]*MEc[k] + y[9,k]*MEi[k] - z[r,j]);

subject to 
rcleaning {j in 1..12}: x[1,j] + x[4,j] + x[7,j] <= 1000; #marmelos r
rcooking {j in 1..12}: x[1,j] + x[4,j] + x[7,j] <= 1850;
rpacking {j in 1..12}: x[1,j] + x[4,j] + x[7,j] <= 750; 

ccleaning {j in 1..12}: x[2,j] + x[5,j] + x[8,j] <= 1525; #marmelos c
ccooking {j in 1..12}: x[2,j] + x[5,j] + x[8,j] <= 850;
cpacking {j in 1..12}: x[2,j] + x[5,j] + x[8,j] <= 1500; 

icleaning {j in 1..12}: x[3,j] + x[6,j] + x[9,j] <= 1750; #marmelos i
icooking {j in 1..12}: x[3,j] + x[6,j] + x[9,j] <= 1200;
ipacking {j in 1..12}: x[3,j] + x[6,j] + x[9,j] <= 2000; 

Vcapacity {j in 1..12}: sum {k in 1..3} y[k,j] <= 1000;
MAcapacity {j in 1..12}: sum {k in 4..6} y[k,j] <= 1000;
MEcapacity {j in 1..12}: sum {k in 7..9} y[k,j] <= 1000;

enviar1 {r in 1..9}: y[r,1] <= x[r,1];
enviarg {r in 1..9, j in 2..12}: y[r,j] <= x[r,j] + (z[r,j-1]);
nostock {r in 1..9}: y[r,12] - (x[r,12] + z[r,11]) = 0;


stock1 {r in 1..9}: z[r,1] = x[r,1] - y[r,1];
stock2 {r in 1..9, j in 2..11}: z[r,j] = x[r,j] - y[r,j] + z[r,j-1];