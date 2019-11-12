#! /usr/bin/env python3

# This script can be used to prune the ensembl-static-assets repo, removing
# any WASM files which are unreferenced from ensembl-client. This is so
# that this repo can be GCed and so kept to a sensible size. Note that this
# script doesn't actually do the GC-ing itself, leaving it to you or to
# github's default gc-ing schedule. You will probably need to do a
# (git gc --prune=now) and then push it, though there's not a lot of info on
# github about the right way to do this.
#
#

import collections, optparse, os, re, subprocess, sys, tempfile

CLIENT_REPO_NAME="ensembl-client"
CLIENT_REPO="https://github.com/Ensembl/{0}.git"

ASSET_REPO_NAME="throwaway-ensembl-static-assets"
ASSET_REPO="git@github.com:azangru/{0}.git"

parser = optparse.OptionParser()
parser.add_option("-n", "--dry-run", action="store_true", dest="dry", help="dry run", default=False)
(options, args) = parser.parse_args()

vip_branches = set(["master","dev","feature/use-npm-test"])

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

# Extract wasm-in-use tag from package.json blob
depline_re = re.compile(r'.*"ensembl-genome-browser":.*#(.*)"')
def extract_tag(blob):
  contents = run(["git","cat-file","-p",blob],stdout=subprocess.PIPE)
  for line in contents.split("\n"):
    m = depline_re.match(line)
    if m:
      return m.group(1)
  return None

# ensembl-client repo investigation
tags_in_use = set()
vip_wasms = {}
with tempfile.TemporaryDirectory() as tmpdirname:
  os.chdir(tmpdirname)
  repo = CLIENT_REPO.format(CLIENT_REPO_NAME)
  print("tmpdir is {0}".format(tmpdirname))
  run(["git","clone",repo])
  os.chdir(CLIENT_REPO_NAME)

  # Get list of tags in use
  blobs = run(["git","rev-list","--all","--objects","src/ensembl/package.json"],stdout=subprocess.PIPE)
  for blob in blobs.split("\n"):
    parts = blob.strip().split(' ',1)
    if len(parts) < 2 or parts[1] != "src/ensembl/package.json":
      continue
    tag = extract_tag(parts[0])
    if tag:
      tags_in_use.add(tag)

  # get VIP wasms (used for warnings)
  for branch in vip_branches:
    run(["git","checkout",branch])
    blobs = run(["git","ls-tree",branch,"--full-tree","src/ensembl/package.json"],stdout=subprocess.PIPE,fail_ok=True)
    for blob in blobs.split("\n"):
      parts = blob.split()
      if len(parts) < 4:
        continue
      if parts[1] == 'blob' and parts[3] == 'src/ensembl/package.json':
        vip_wasms[branch] = extract_tag(parts[2])

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

# list tags in repo
tag_re = re.compile(r'tag: (.*)')
def list_tags():
  tags = {}
  untagged = []
  logs=run(["git","log","--pretty=format:%H %D"],stdout=subprocess.PIPE)
  for log in logs.split("\n"):
    parts = log.split(" ",1)
    tagged = False
    for ref in parts[1].split(', '):
      m = tag_re.match(ref) 
      if m and m.group(1):
        tags[m.group(1)] = parts[0]
        tagged = True
    if not tagged:
      untagged.append(parts[0])
  return (tags,untagged)

# y/n for user
def confirm(msg):
  while True:
    confirm = input(msg).lower().strip()
    if confirm.startswith("n"):
      sys.stderr.write("Abandoning at your request\n")
      sys.exit(1)
    elif confirm.startswith("y"):
      break
    else:
      sys.stderr.write("Eh?\n")
    
with tempfile.TemporaryDirectory() as tmpdirname:
  # Checkout asset repo
  os.chdir(tmpdirname)
  repo = ASSET_REPO.format(ASSET_REPO_NAME)
  print("tmpdir is {0}".format(tmpdirname))
  run(["git","clone",repo])
  os.chdir(ASSET_REPO_NAME)

  # Set tags
  restore_tags()

  # make squash commit list and delete tag
  origin = None
  unused = set()
  sed = []
  (tags_in_repo,untagged) = list_tags()
  unused |= set(untagged)
  for (wasm,blob) in tags_in_repo.items():
    if wasm.startswith("wasm/") and wasm not in tags_in_use:
      unused.add(blob)
      run(["git","tag","-d",wasm],fail_ok=True)
  print('unused',unused)
  if 'root' not in tags_in_repo:
    sys.stderr.write("Could not find origin tag")
    sys.exit(1)
  origin = tags_in_repo['root']

  # squash
  squash_file = os.path.join(tmpdirname,"squashes")
  with open(squash_file,"w") as f:
    for githash in unused:
      f.write(githash+"\n")
  prune_squasher = os.path.join(self_dir,"prune-squasher.py")
  env = os.environ.copy()
  env['GIT_SEQUENCE_EDITOR'] = "{0} {1}".format(prune_squasher,squash_file)
  env['GIT_EDITOR'] = "cat"
  run(["git","rebase","-i",origin],env=env)

  # Reset tags
  restore_tags()

  # Check VIP branch wasms are still in the repo
  (tags_in_repo,untagged) = list_tags()
  tags_in_repo = set(tags_in_repo.keys())
  warnings = False
  sys.stderr.write("\n")
  for (branch,wasm) in vip_wasms.items():
    if wasm in tags_in_repo:
      sys.stderr.write("{0}'s wasm ({1}) is in repo. Good!\n".format(branch,wasm[:13]))
    else:
      sys.stderr.write("WARNING! {0}'s wasm ({1}) would not be in rebased repo!\n".format(branch,wasm))
      warnings = True
  if warnings:
    sys.stderr.write("\n\nwasms missing from repo. Continuing at this point may break 2020 live, deployed site. Strongly suggest not coninuing\n\n")
    confirm("continue and maybe break live site? ")

  # log and confirm
  run(["git","log"])
  if options.dry:
    sys.stderr.write("Exiting as was dry run\n")
    sys.exit(1)

  confirm("Is this ok to push? ")

  # push
  run(["git","push","--force"])
  run(["git","push","--tags","--force"])
  (tags_local,untagged) = list_tags()
  tags_local = set(tags_local.keys())

with tempfile.TemporaryDirectory() as tmpdirname:
  # Checkout asset repo (again) to aid pruning
  os.chdir(tmpdirname)
  repo = ASSET_REPO.format(ASSET_REPO_NAME)
  print("tmpdir is {0}".format(tmpdirname))
  run(["git","clone",repo])
  os.chdir(ASSET_REPO_NAME)

  # remove any unused tags from remote
  tags_remote = set(run(["git","tag"],stdout=subprocess.PIPE).split("\n"))
  for old_tag in tags_remote-tags_local:
    if old_tag.startswith("wasm/"):
      run(["git","push","origin",":"+old_tag])

