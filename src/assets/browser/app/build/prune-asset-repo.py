#! /usr/bin/env python3

import os, re, subprocess, sys, tempfile

CLIENT_REPO_NAME="ensembl-client"
CLIENT_REPO="https://github.com/Ensembl/{0}.git"

ASSET_REPO_NAME="throwaway-ensembl-static-assets"
ASSET_REPO="git@github.com:azangru/{0}.git"

self_dir = os.path.dirname(os.path.abspath(__file__))

# Generic means of running stuff
def run(*args,**kwargs):
  if 'stderr' not in kwargs:
    kwargs['stderr'] = subprocess.PIPE
  fail_ok = False
  if 'fail_ok' in kwargs:
    fail_ok = kwargs['fail_ok']
    del kwargs['fail_ok']
  print(" ".join(args[0]))
  proc = subprocess.run(*args,**kwargs)
  if proc.stderr != None:
    sys.stderr.write(proc.stderr.decode("utf8"))
  if proc.returncode != 0 and not fail_ok:
    sys.stderr.write("Cannot run {0} {1}".format(args,kwargs))
    sys.exit(1)
  return proc.stdout.decode("utf8") if proc.stdout else ""

# Get list of tags in use
depline_re = re.compile(r'.*"ensembl-genome-browser":.*#(.*)"')
tags_in_use = set()
with tempfile.TemporaryDirectory() as tmpdirname:
  os.chdir(tmpdirname)
  repo = CLIENT_REPO.format(CLIENT_REPO_NAME)
  print("tmpdir is {0}".format(tmpdirname))
  run(["git","clone",repo])
  os.chdir(CLIENT_REPO_NAME)
  blobs = run(["git","rev-list","--all","--objects","src/ensembl/package.json"],stdout=subprocess.PIPE)
  for blob in blobs.split("\n"):
    parts = blob.strip().split(' ',1)
    if len(parts) < 2 or parts[1] != "src/ensembl/package.json":
      continue
    contents = run(["git","cat-file","-p",parts[0]],stdout=subprocess.PIPE)
    for line in contents.split("\n"):
      m = depline_re.match(line)
      if m:
        tags_in_use.add(m.group(1))

print('tags in use'," ".join(tags_in_use))
  
# Ability to restore tags to rightful commits after rebase (kills tags)
browser_re = re.compile(r'browser-(.*)\.wasm')
def restore_tags():
  commits=run(["git","log","--pretty=format:%H"],stdout=subprocess.PIPE)
  seen = set()
  for commit in commits.split("\n"):
    files = run(["git","ls-tree",commit],stdout=subprocess.PIPE)
    for line in files.split("\n"):
      parts = line.split(None,3)
      if len(parts) < 4:
        continue
      m = browser_re.match(parts[3])
      if m:
        tagname = "wasm/{0}".format(m.group(1))
        run(["git","tag","-d",tagname],fail_ok=True)
        run(["git","tag",tagname,commit])

tag_re = re.compile(r'tag: (wasm/.*)')
with tempfile.TemporaryDirectory() as tmpdirname:
#if 0:
  #tmpdirname = "/tmp/c"
  # Checkout asset repo
  os.chdir(tmpdirname)
  repo = ASSET_REPO.format(ASSET_REPO_NAME)
  print("tmpdir is {0}".format(tmpdirname))
  run(["git","clone",repo])
  os.chdir(ASSET_REPO_NAME)

  # Set tags
  restore_tags()

  # get squash commit list
  origin = None
  logs=run(["git","log","--pretty=format:%H %D"],stdout=subprocess.PIPE)
  unused = set()
  sed = []
  for log in logs.split("\n"):
    in_use = False
    parts = log.split(" ",1)
    for ref in parts[1].split(', '):
      m = tag_re.match(ref) 
      if m: # and m.group(1) in tags_in_use:
        in_use = True
      if 'tag: root' in ref:
        origin = parts[0]
        in_use = True
        break
    if not in_use:
      unused.add(parts[0])
  print('unused',unused)
  if origin == None:
    sys.stderr.write("Could not find origin tag")
    sys.exit(1)

  # Write squash file
  squash_file = os.path.join(tmpdirname,"squashes")
  with open(squash_file,"w") as f:
    for githash in unused:
      f.write(githash+"\n")
  prune_squasher = os.path.join(self_dir,"prune-squasher.py")
  env = os.environ.copy()
  env['GIT_SEQUENCE_EDITOR'] = "{0} {1}".format(prune_squasher,squash_file)
  env['GIT_EDITOR'] = "cat"
  run(["git","rebase","-i",origin],env=env)

  # Set tags
  restore_tags()

  run(["git","log"])
 
