#! /usr/bin/env python3

# We record all LRU inequalities in a 6-bit bitmap and update them
# as usages happen by bitmasking. The result can then be looked up in
# the precomupted 6-bit LRU lookup
#

import sys

crit = [(3,2),(3,1),(3,0),(2,1),(2,0),(1,0)]

decision = {}

def bitmap(A):
    pos = [4,4,4,4]
    for (i,v) in enumerate(A):
        pos[v] = i
    mask = 1
    v = 0
    for (a,b) in crit:
        v <<= 1
        if pos[a]<pos[b]:
            v |= 1
    decision[v] = A[3]

# Heap's algorithm for permutations
def generate(k,A):
    if k == 1:
      bitmap(A)
    else:
      generate(k-1,A)
      for i in range(0,k-1):
        j = 0 if k%2 else i
        (A[j],A[k-1])=(A[k-1],A[j])
        generate(k-1,A)

generate(4,[0,1,2,3])

sys.stdout.write("""
/* 4-bit true LRU via bitmask: see lrugen.py */
const cache_lru : [u8;64] = [
""")
for i in range(64):
    if i%8 == 0:
        sys.stdout.write("\n")
    v = decision.get(i,9)
    sys.stdout.write("  {0:1}{1}".format(v,"," if i<63 else "\n"))
sys.stdout.write("""];

const cache_use_keep : [u8;4] = [
  0b110100, 0b101011, 0b011111, 0b111111
];

const cache_use_set : [u8;4] = [
  0b000000, 0b000001, 0b000110, 0b111000
];
""")
