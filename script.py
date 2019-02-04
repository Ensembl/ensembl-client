#!/usr/bin/env python3

import os
import shlex
import sys
import tempfile

import sh

def _get_commits(fname):
    # Ask for the commit and the timestamp
    # .. the timestamp doesn't guarantee ordering, but good enough
    for c in sh.git('log', '--follow', '--pretty=%ct %h', fname,
                   _tty_out=False, _iter=True):
        c = c.strip().split()
        yield int(c[0]), c[1]

def git_log_follow_multi(filenames):
    if len(filenames) == 0:
        print("Specify at least one file to log")
    elif len(filenames) <= 1:
        os.system('git log --follow -p %s' % filenames[0])
    else:
        # Use git log to generate lists of commits for each file, sort
        commits = []
        for fname in filenames:
            commits += _get_commits(fname)

        # Sort the lists (python's sort is stable)
        commits.sort(reverse=True)

        # Uniquify (http://www.peterbe.com/plog/uniqifiers-benchmark)
        seen = set()
        seen_add = seen.add
        commits = [c for c in commits if not (c in seen or seen_add(c))]

        # Finally, display them
        tname = None

        try:
            file_list = ' '.join(shlex.quote(fname) for fname in filenames)

            with tempfile.NamedTemporaryFile(mode='w', delete=False) as fp:
                tname = fp.name
                for _, commit in commits:
                    fp.write('git log -p -1 --color %s %s\n' % (commit, file_list))

            # Use os.system to make our lives easier
            os.system('bash %s | less -FRX' % tname)
        finally:
            if tname:
                os.unlink(tname)


if __name__ == '__main__':
    git_log_follow_multi(sys.argv[1:])
