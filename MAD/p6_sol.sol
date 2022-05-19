Problem:    pratica6
Rows:       12
Columns:    6
Non-zeros:  24
Status:     OPTIMAL
Objective:  z = 6285.714286 (MAXimum)

   No.   Row name   St   Activity     Lower bound   Upper bound    Marginal
------ ------------ -- ------------- ------------- ------------- -------------
     1 z            B        6285.71                             
     2 R1           NU          6000                        6000      0.761905 
     3 R2           NU         60000                       60000     0.0285714 
     4 M1           NU             0                          -0         < eps
     5 M2           B              0                        9000 
     6 M3           NU             0                          -0         < eps
     7 M4           B              0                        9000 
     8 M5           B              0                          -0 
     9 M6           B              0                        9000 
    10 M7           B      0.0571429                           1 
    11 M8           B       0.171429                           1 
    12 M9           B              0                           1 

   No. Column name  St   Activity     Lower bound   Upper bound    Marginal
------ ------------ -- ------------- ------------- ------------- -------------
     1 x1           B        571.429             0               
     2 x2           B        1714.29             0               
     3 x3           NL             0             0                   -0.952381 
     4 y1           B      0.0571429             0               
     5 y2           B       0.171429             0               
     6 y3           NL             0             0                       < eps

Karush-Kuhn-Tucker optimality conditions:

KKT.PE: max.abs.err = 1.14e-13 on row 4
        max.rel.err = 9.94e-17 on row 4
        High quality

KKT.PB: max.abs.err = 0.00e+00 on row 0
        max.rel.err = 0.00e+00 on row 0
        High quality

KKT.DE: max.abs.err = 3.94e-12 on column 5
        max.rel.err = 3.94e-12 on column 5
        High quality

KKT.DB: max.abs.err = 3.94e-16 on row 6
        max.rel.err = 3.94e-16 on row 6
        High quality

End of output
