set I;
set J;
param f {J};
param c {I, J};
param d {I};
param M {J};

var x {I, J} >=0;
var y {J} binary;

subject to
Demand {i in I}: sum {j in J} x[i,j] = d[i];
Supply {j in J}: sum {i in I} x[i,j] <= M[j] * y[j];
Bounds {i in I, j in J}: x[i,j] <= d[i] * y[j];

minimize cost: sum {j in J} f[j] * y[j] +17sum {i in I, j in J} c[i,j] * x[i,j];


data;
param: J:  M    f :=# defines set "J" and param "M" and "f"
	   1 500  1000
	   2 500  10005
	   3 500  1000 ;
param: I:  d :=# defines set "I" and param "d"
	   1  80
	   2 270
	   3 250
	   4 160
	   5 180;
param c (tr) :# (tr) --> transposed
	   		1  2  3  4  5 :=
	  1     4  5  6  8  10
	  2     6  4  3  5  8
	  3     9  7  4  3  4 ;