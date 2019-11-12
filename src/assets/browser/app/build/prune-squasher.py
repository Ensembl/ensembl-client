#! /usr/bin/env python3

import re, sys

if len(sys.argv) != 3:
  sys.stderr.write("Must supply exactly two arguments got {0}".format(sys.argv))
  sys.exit(1)

squashes = []
with open(sys.argv[1]) as squash_file:
  for squash in squash_file.readlines():
    squashes.append(squash.strip())

sys.stderr.write("Commits to squash:\n{0}\n\n".format("\n".join(squashes)))

def match(subhash):
  for squash in squashes:
    if squash.startswith(subhash):
      return True
  return False

new_contents = []
pick_re = re.compile(r'pick\s+(\S+)\s')
with open(sys.argv[2]) as edit_file:
  squash = False
  for line in edit_file.readlines():
    m = pick_re.match(line)
    if m:
      if squash:
        line = pick_re.sub("squash {0} ".format(m.group(1)),line)
      squash = match(m.group(1))
    new_contents.append(line)
with open(sys.argv[2],"w") as edit_file:
  edit_file.write("".join(new_contents))
sys.stderr.write("".join(new_contents))
