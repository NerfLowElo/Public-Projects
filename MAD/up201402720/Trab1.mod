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

maximize lucro: sum {k in 1..12}  (x[1,k]*Vr[k] + x[2,k]*Vc[k] + x[3,k]*Vi[k] + x[4,k]*MAr[k] + x[5,k]*MAc[k] + x[6,k]*MAi[k] + x[7,k]*MEr[k] + x[8,k]*MEc[k] + x[9,k]*MEi[k]);

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

Vcapacity {j in 1..12}: sum {k in 1..3} x[k,j] <= 1000;
MAcapacity {j in 1..12}: sum {k in 4..6} x[k,j] <= 1000;
MEcapacity {j in 1..12}: sum {k in 7..9} x[k,j] <= 1000;