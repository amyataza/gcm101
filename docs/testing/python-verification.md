# Python snippet verification

Run on 2026-10-06 with Python 3.13.9 and scipy 1.18.1 by `npm run test:python`.
Every number a snippet prints must appear in its own comments, in the module's worked-example text, or as an input literal the snippet echoes.

| Snippet | Example | Result | Numbers printed | Unmatched |
|---|---|:-:|--:|---|
| M0 we-0.3 | Average and spread of returns | ✅ pass | 2 | — |
| M4 m4-python | Python for this module | ✅ pass | 6 | — |
| M5 m5-python | Python | ✅ pass | 4 | — |
| M7 we-7.4 | How index weighting changes the answer | ✅ pass | 3 | — |
| M8 m8-python | Python | ✅ pass | 3 | — |
| M9 m9-python | Python | ✅ pass | 37 | — |
| M10 we-10.3 | What fees do over 20 years | ✅ pass | 4 | — |
| M12 m12-python | Python | ✅ pass | 8 | — |
| M13 m13-python | Python | ✅ pass | 8 | — |
| M14 m14-python | Python | ✅ pass | 18 | — |
| M15 m15-python | Python | ✅ pass | 6 | — |
| M16 m16-python | Python | ✅ pass | 9 | — |
| M17 m17-python | Python | ✅ pass | 8 | — |

**13 of 13 snippets pass.**

## Raw output

### M0 we-0.3 — Average and spread of returns

```
0.01
0.0158
```

### M4 m4-python — Python for this module

```
14693.28
839.62
0.1268
4100.2
-210.37
0.089
```

### M5 m5-python — Python

```
9898.89
0.0404
0.041
13424.66
```

### M7 we-7.4 — How index weighting changes the answer

```
price-weighted 5.29%
cap-weighted   -1.43%
equal-weighted 1.67%
```

### M8 m8-python — Python

```
18.6058 6058
4.21%
```

### M9 m9-python — Python

```
Day 1: P&L +8,000  balance 58,000  margin call 0
Day 2: P&L -18,000  balance 40,000  margin call 0
Day 3: P&L -4,000  balance 36,000  margin call 14,000
Day 4: P&L +16,000  balance 66,000  margin call 0
80 call profit: -5  put profit: 16
90 call profit: -5  put profit: 6
96 call profit: -5  put profit: 0
100 call profit: -5  put profit: -4
105 call profit: 0  put profit: -4
110 call profit: 5  put profit: -4
120 call profit: 15  put profit: -4
```

### M10 we-10.3 — What fees do over 20 years

```
0.002 37275.64
0.015 29177.57
```

### M12 m12-python — Python

```
200500.0 50.125
{'A': 400, 'B': -200, 'C': -200} 2400 400 83% reduction
```

### M13 m13-python — Python

```
924.18
102.75
0.06458
4.2814 3.8922 20.1
-35.97 -35.06
```

### M14 m14-python — Python

```
0.152
35.0
18.67
0.0971
19.4
681.81
0.1 [34.67, 42.0, 53.0]
0.11 [29.71, 35.0, 42.4]
0.12 [26.0, 30.0, 35.33]
```

### M15 m15-python — Python

```
106.0 103.92
7.14
10.45 5.57
0.06955
```

### M16 m16-python — Python

```
0.1014
1 0.122
0 0.0955
-1 0.058
1.55 0.1527
```

### M17 m17-python — Python

```
0.95 197382
0.99 279162
624234
21000.0 25500.0
9000.0
```
