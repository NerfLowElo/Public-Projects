Problem:    quizz11
Rows:       9
Columns:    6
Non-zeros:  21
Status:     OPTIMAL
Objective:  z = 4100000 (MINimum)

   No.   Row name   St   Activity     Lower bound   Upper bound    Marginal
------ ------------ -- ------------- ------------- ------------- -------------
     1 z            B        4.1e+06                             
     2 R1           NL         80000         80000                       51.25 
     3 R2           B          60000         50000               
     4 M1           NU             0                          -0          -0.5 
     5 M2           B              0                          -0 
     6 M3           B              0                          -0 
     7 M4           B              1                           1 
     8 M5           B              0                           1 
     9 M6           B              0                           1 

   No. Column name  St   Activity     Lower bound   Upper bound    Marginal
------ ------------ -- ------------- ------------- ------------- -------------
     1 x1           B         200000             0               
     2 x2           NL             0             0                     17.1875 
     3 x3           NL             0             0                       29.75 
     4 y1           B              1             0               
     5 y2           NL             0             0                       60000 
     6 y3           NL             0             0                       40000 

Karush-Kuhn-Tucker optimality conditions:

KKT.PE: max.abs.err = 5.82e-11 on row 4
        max.rel.err = 1.46e-16 on row 4
        High quality

KKT.PB: max.abs.err = 2.22e-16 on row 7
        max.rel.err = 1.11e-16 on row 7
        High quality

KKT.DE: max.abs.err = 1.60e-10 on column 4
        max.rel.err = 8.00e-16 on column 4
        High quality

KKT.DB: max.abs.err = 0.00e+00 on row 0
        max.rel.err = 0.00e+00 on row 0
        High quality

End of output
