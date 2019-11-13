#! /usr/bin/env python3

import re, sys

if len(sys.argv) != 2:
  sys.stderr.write("Must supply exactly one argument. got {0}".format(sys.argv))
  sys.exit(1)

def match(subhash):
  for squash in squashes:
    if squash.startswith(subhash):
      return True
  return False

new_contents = []
pick_re = re.compile(r'pick\s+(\S+)\s')
with open(sys.argv[1]) as edit_file:
  for (i,line) in enumerate(edit_file.readlines()):
    m = pick_re.match(line)
    if m and i>0:
      line = pick_re.sub("squash {0} ".format(m.group(1)),line)
    new_contents.append(line)
with open(sys.argv[1],"w") as edit_file:
  edit_file.write("".join(new_contents))
sys.stderr.write("".join(new_contents))
