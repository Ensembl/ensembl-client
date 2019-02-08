#! /usr/bin/env perl

use strict;
use warnings;

# Check updated

my $lines = qx(find . -name \*.wasm -printf '%p %T@\n');
my $asset = 0;
my $deploy = 0;
my $other = 0;
my $other_name = '';
foreach my $line (split(/\n/,$lines)) {
  my ($filename,$mtime) = split(' ',$line);
  if($filename =~ m!/deploy!) {
    $deploy = $mtime;
  } elsif($filename =~ m!/static/browser!) {
    $asset = $mtime;
  } elsif($mtime > $other) {
    $other = $mtime;
    $other_name = $filename;
  }
}
if($other > $deploy) {
  warn "deploy wasm is older than $other_name. Run deploy.sh!\n";
  exit 1;
}
if($other > $asset) {
  warn "asset wasm is older than $other_name. Run deploy.sh!\n";
  exit 1;
}

# And due to be committed
my $state = qx(git status --porcelain);
foreach my $line (split(/\n/,$state)) {
  my ($status,$filename) = split(' ',$line);
  if($filename =~ m!/browser\.(wasm|js)$! && $status =~ /.M$/) {
    die "$filename not due to be committed!\n";
  }
}

1;

