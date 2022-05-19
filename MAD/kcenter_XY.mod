param k;
param N;  # number of points
param X{1..N};  # x coordinates
param Y{1..N};  # y coordinates

param c {i in 1..N, j in 1..N} := sqrt((X[i]-X[j])^2 + (Y[i]-Y[j])^2);

var x {1..N, 1..N} binary;
var y {1..N} binary;
var z >= 0;

minimize cost: z;

subject to
Service {i in 1..N}: sum {j in 1..N} x[i,j] = 1;
Kfacil: sum {j in 1..N} y[j] = k;
Activate {i in 1..N, j in 1..N}: x[i,j] <= y[j];
MinZ {i in 1..N}: sum {j in 1..N} c[i,j] * x[i,j] <= z;