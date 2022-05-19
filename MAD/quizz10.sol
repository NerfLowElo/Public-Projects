Problem:    quizz10
Rows:       6
Columns:    6 (3 integer, 3 binary)
Non-zeros:  18
Status:     INTEGER OPTIMAL
Objective:  z = 110 (MAXimum)

   No.   Row name        Activity     Lower bound   Upper bound
------ ------------    ------------- ------------- -------------
     1 z                         110                             
     2 labor                     180                         180 
     3 cloth                     120                         160 
     4 M1                          0                          -0 
     5 M2                          0                          -0 
     6 M3                          0                          -0 

   No. Column name       Activity     Lower bound   Upper bound
------ ------------    ------------- ------------- -------------
     1 x1                          0             0               
     2 x2                          0             0               
     3 x3                         30             0               
     4 y1           *              0             0             1 
     5 y2           *              0             0             1 
     6 y3           *              1             0             1 

Integer feasibility conditions:

KKT.PE: max.abs.err = 0.00e+00 on row 0
        max.rel.err = 0.00e+00 on row 0
        High quality

KKT.PB: max.abs.err = 0.00e+00 on row 0
        max.rel.err = 0.00e+00 on row 0
        High quality

End of output
