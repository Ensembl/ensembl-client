#! /usr/bin/env python

import sys, os, os.path, re, collections

re_brace = re.compile(r"(.*)\{(.*)\}")
def braced_alphabetic(filename,line):
  m = re_brace.search(line)
  if m:
    parts = m.group(2).split(",")
    if parts != sorted(parts):
      print("Bad bracing",filename,line)
    if len(parts) < 2:
      print("Overbracing",filename)
    return m.group(1)
  else:
    return None

def sortkey(use):
  parts = use.split("::")
  if parts[0] == 'crate':
    section = 1
  elif parts[0] == 'super' and parts[1] == 'super':
    section = 2
  elif parts[0] == 'super':
    section = 3
  else:
    section = 0
  return (section,use)

re_super = re.compile(r"(.*::)[^:]+")
def check(filename,lines):
  lines = [ line[4:].rstrip(";") for line in lines ]
  dirs = collections.defaultdict(int)
  for line in lines:
    b = braced_alphabetic(filename,line)
    if b != None:
      dirs[b] += 1
    else:
      m = re_super.match(line)
      if m:
        dirs[m.group(1)] += 1
  for (name,val) in dirs.items():
    if val > 1:
      print("duplicate",filename,name)
  sorted_lines = sorted(lines,key=sortkey) 
  if sorted_lines != lines:
    print("out of order\n{}\n{}".format(filename,"\n".join(["use {};".format(x) for x in sorted_lines])))
    print("\n\n")

use_lines = {}
for filename in sys.stdin.readlines():
  filename = filename.strip()
  our_lines = []
  path = os.path.join(os.getcwd(),filename)
  with open(path) as rust_file:
    at_top = True
    in_tests = False
    for line in rust_file.readlines():
      line = line.strip()
      if line.startswith("use") and not in_tests:
        if at_top:
          our_lines.append(line)
        else:
          print("Unexpected use line",path,line)
      elif line.startswith("#"):
        check(filename,our_lines)
        at_top = True
        our_lines = []
      elif at_top and line != '':
        at_top = False
      if "mod test" in line:
        check(filename,our_lines)
        our_lines = []
        at_top = True
  check(filename,our_lines)

