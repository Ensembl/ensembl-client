#! /usr/bin/env python3

# This script can be used to prune the ensembl-static-assets repo, removing
# any WASM files which are unreferenced from ensembl-client. This is so
# that this repo can be GCed and so kept to a sensible size. Note that this
# script doesn't actually do the GC-ing itself, leaving it to you or to
# github.
#
# The script works out what needs to be kept by inspecting all versions of
# package.json anywhere in the ensmebl-client repo. For each of these it
# extracts the tag in use in that package.json. At this stage it also inspects
# "VIP" branches (master and dev for now) and inspects which WASMs it
# DEFINITELY doesn't want to delete as a double check for later. (They should
# never be deleted by this script anyway). 
#
# The main tidying begins with a new commit which removes unused tar files.
# When that's committed, a "non-interactive" interactive rebase squashes
# everything down to a single commit (to remove all references to the deleted
# files, allowing them to be collected). 
#
# When this is done, the log is presented to the user for inspection and if
# the user agrees the updated repo is force-pushed. There's then a final
# fiddly step to remove tags on the remote (necessary for github to gc our
# repo) by checking out the newly-pushed repo again and comparing the tags
# which are there to what we expect and removing all others.

import collections, optparse, os, re, subprocess, sys, tempfile

CLIENT_REPO_NAME="ensembl-client"
CLIENT_REPO="https://github.com/Ensembl/{0}.git"

ASSET_REPO_NAME="ensembl-genome-browser-assets"
ASSET_REPO="git@github.com:Ensembl/{0}.git"

parser = optparse.OptionParser()
parser.add_option("-n", "--dry-run", action="store_true", dest="dry", help="dry run", default=False)
(options, args) = parser.parse_args()

vip_branches = set(["master","dev"])

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
depline_re = re.compile(r'.*"ensembl-genome-browser":.*/assets-(.*?)\..*"')
def extract_tag(blob):
  contents = run(["git","cat-file","-p",blob],stdout=subprocess.PIPE)
  for line in contents.split("\n"):
    m = depline_re.match(line)
    if m:
      return m.group(1)
  return None

# Extract all wasms referred to in client repo
def list_tags():
  out = []
  blobs = run(["git","rev-list","--all","--objects","src/ensembl/package.json"],stdout=subprocess.PIPE)
  for blob in blobs.split("\n"):
    parts = blob.strip().split(' ',1)
    if len(parts) < 2 or parts[1] != "src/ensembl/package.json":
      continue
    tag = extract_tag(parts[0])
    if tag:
      out.append(tag)
  return set(out)
  
# List all assets in asset repo
asset_tar_re = re.compile(r'assets-(.*)\.tar\.gz') 
def list_assets():
  out = []
  for filename in os.listdir("."):
    m = asset_tar_re.match(filename)
    if m and m.group(1):
        out.append(m.group(1))
  return set(out)

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
  tags_in_use = list_tags()

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

lines =(["","tags in use"]+sorted(list(tags_in_use))+
        ["","VIP tags"]+[ "{0} {1}".format(*x) for x in vip_wasms.items() ]+
        [""])

print("\n".join(lines))

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

  # Find, delete, commit unused assets
  all_wasms = list_assets()
  for old_wasm in all_wasms - tags_in_use:
    filename = "assets-{0}.tar.gz".format(old_wasm)
    run(["rm",filename])
    run(["git","rm",filename])
  print("{0} assets in use; {1} no longer in use".format(
    len(tags_in_use),len(all_wasms-tags_in_use)
  ))  
  run(["git","commit","-m","Repo prune"])

  # Find first commit
  origin = run(["git","log","--max-parents=0","--pretty=format:%H"],stdout=subprocess.PIPE).split("\n")[0]
  print("first commit is {0}".format(origin))

  # Squash everything to single commit
  prune_squasher = os.path.join(self_dir,"prune-squasher.py")
  env = os.environ.copy()
  env['GIT_SEQUENCE_EDITOR'] = prune_squasher
  env['GIT_EDITOR'] = "cat"
  run(["git","rebase","-i",origin],env=env)
  run(["git","commit","--amend","-m","wasm assets"])
  run(['git','log']) 

  run(["ls","-l"])

  # Check VIP branch wasms are still in the repo
  tags_in_repo = list_assets()
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

