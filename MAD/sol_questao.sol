Problem:    questaoaula
Rows:       5
Columns:    8
Non-zeros:  39
Status:     OPTIMAL
Objective:  cost = 88.2 (MINimum)

   No.   Row name   St   Activity     Lower bound   Upper bound    Marginal
------ ------------ -- ------------- ------------- ------------- -------------
     1 cost         B           88.2                             
     2 A            NL           700           700                  0.00181818 
     3 C            B        1633.33           700               
     4 B1           B            700           700               
     5 B2           NL           700           700                    0.124182 

   No. Column name  St   Activity     Lower bound   Upper bound    Marginal
------ ------------ -- ------------- ------------- ------------- -------------
     1 Xbeef        NL             0             0                     1.21818 
     2 Xchk         NL             0             0                   0.0918182 
     3 Xfish        NL             0             0                     1.03364 
     4 Xham         NL             0             0                     1.57545 
     5 Xmch         B        46.6667             0               
     6 Xmtl         B              0             0               
     7 Xspg         NL             0             0                   0.0818182 
     8 Xtur         NL             0             0                     1.13909 

Karush-Kuhn-Tucker optimality conditions:

KKT.PE: max.abs.err = 2.27e-13 on row 5
        max.rel.err = 1.62e-16 on row 5
        High quality

KKT.PB: max.abs.err = 2.27e-13 on row 4
        max.rel.err = 3.24e-16 on row 4
        High quality

KKT.DE: max.abs.err = 6.66e-16 on column 5
        max.rel.err = 1.39e-16 on column 5
        High quality

KKT.DB: max.abs.err = 0.00e+00 on row 0
        max.rel.err = 0.00e+00 on row 0
        High quality

End of output
