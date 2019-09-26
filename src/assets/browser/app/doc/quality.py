#! /usr/bin/env python3

import os, sys, yaml, subprocess, collections

# Load config
config_filename = os.path.join(
  os.path.dirname(os.path.realpath(__file__)),
  "quality.yaml")

with open(config_filename) as f:
  config = yaml.load(f,Loader=yaml.SafeLoader)

# Find root
root = os.path.realpath(__file__)
while True:
  (root,tail) = os.path.split(root)
  if tail == "browser":
    break
  if root == "/":
    print("cannot find root directory",file=sys.stderr)
    sys.exit(1)

def inner_match(needle,haystack):
  for i in range(0,len(haystack)-len(needle)):
    match = True
    for j in range(0,len(needle)):
      if needle[j] != haystack[i+j]:
        match = False
        break
    if match:
      return True
  return False

def colour_match(path):
  best = "unknown"
  best_len = -1
  for (type_,patterns) in config['status'].items():
    for pattern in patterns:
      needle = pattern.split("/")
      if len(needle) > best_len and inner_match(needle,path):
        best_len = len(needle)
        best = type_
  return best

def count_lines(filename):
  with open(filename) as f:
    return len(f.readlines())

# Classify found files
files = collections.defaultdict(int)
lines = collections.defaultdict(int)
result = subprocess.run(['find',root,'-name','*.rs','-printf','%P\n'], stdout=subprocess.PIPE)
for line in result.stdout.decode("utf8").split("\n"):
  if not line:
    continue
  parts = list(line.split("/"))
  skip = False
  for part in parts:
    if part in config['skip']:
      skip = True
  if skip:
    continue
  colour = colour_match(parts)
  files[colour] += 1
  lines[colour] += count_lines(os.path.join(root,line))

# Count lines
for (colour,line_count) in sorted(lines.items()):
  file_count = files[colour]
  print("{0}: {1} files {2} lines".format(colour,file_count,line_count))


