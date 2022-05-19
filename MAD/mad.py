import random
INF = float('inf')
EPS = 1.e-9


def read_data(data):
    # read lines in the form "(i,j)  a[i,j]  b[i,j]  m[i,j]"
    V, A = set(), []
    a, b, m = {}, {}, {}
    for d in data.split('\n'):
        f1, f2, f3, f4 = d.split()
        (i, j) = eval(f1)
        a[i, j], b[i, j], m[i, j] = int(f2), int(f3), int(f4)
        V.add(i)
        V.add(j)
        A.append((i, j))

    P, S = {}, {}
    for i in V:
        P[i] = set([])
        S[i] = set([])

    for (i, j) in A:
        P[j].add(i)     # predecessors
        S[i].add(j)     # successors

    return list(V), A, P, S, a, b, m


def cpm(V, A, P, S, D):
    ES, LF = {}, {}
    for i in V:
        ES[i] = 0
        LF[i] = INF
    for i in V:
        for j in S[i]:
            ES[j] = max(ES[j], ES[i]+D[i, j])
    tmin = ES[V[-1]]
    LF[V[-1]] = tmin
    for j in reversed(V):
        for i in P[j]:
            LF[i] = min(LF[i], LF[j]-D[i, j])

    critical = []
    for (i, j) in A:
        F = LF[j]-ES[i]-D[i, j]
        if F < EPS:
            critical.append((i, j))

    return tmin, critical


def simulate(N, V, A, P, S, a, b, m):
    t = 0
    p = {}
    for (i, j) in A:
        p[i, j] = 0

    for k in range(N):
        D = {}  # activity durations
        for (i, j) in A:
            D[i, j] = betarnd(a[i, j], m[i, j], b[i, j])

        tmin, critical = cpm(V, A, P, S, D)
        t += tmin
        for (i, j) in critical:
            p[i, j] += 1
        print(f"{tmin:12g}\t{critical}")

    t = float(t)/N
    for (i, j) in A:
        p[i, j] = float(p[i, j])/N

    return t, p


def betarnd(a, m, b):
    if a > b or m > b or m < a:
        raise ValueError
    if a == b:
        return a
    mu = (a+4*m+b)/6.
    if mu == m:
        alpha = 3
    else:
        alpha = (mu - a) * (2 * m - a - b) / ((m - mu) * (b - a))
    beta = alpha * (b - mu) / (mu - a)
    X = random.betavariate(alpha, beta)
    return a + X*(b-a)


if __name__ == "__main__":
    data = """
(1,2)       4      8       6 
(1,3)       2      8       4 
(2,4)       1      7       3 
(3,4)       6      12      9 
(3,5)       5      15     10 
(3,6)       7      18     12 
(4,7)       5      12      9 
(5,8)       1      3       2 
(5,9)       1	   3       2
(6,8)       2      6       3 
(7,9)       10     20     15 
(7,10)      5      28     18 
(8,9)       6      11      9 
(8,11)      7      18     10 
(9,10)      2      2      2  
(9,12)      2      7      4
(10,14)     10     40     25 
(11,12)     5      20     10 
(11,13)     4      18     12  
(12,14)     8      12     10 
(13,14)     7      22     10 
""".strip()

    V, A, P, S, a, b, m = read_data(data)
    D = {}      # mean activity durations
    for (i, j) in A:
        D[i, j] = (a[i, j]+4*m[i, j]+b[i, j])/6.
        print("{:12s}{:12g}".format(str((i, j)), D[i, j]))
    tmin, critical = cpm(V, A, P, S, D)
    print("minimum duration:", tmin)
    print("critical activities:", critical)

    print("simulation")
    N = 10000
    t, p = simulate(N, V, A, P, S, a, b, m)
    print("mean duration:", t)
    print("probability of being critical:")
    for (i, j) in A:
        print("{:12s}{:12g}".format(str((i, j)), p[i, j]))