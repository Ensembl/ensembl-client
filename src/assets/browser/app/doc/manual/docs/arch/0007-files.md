# 0007. Use of files for genome browser

Date: 2020-04

## Status

Provisional

## Consequence of

None

## Context

One of the ways that the genome browser is intended to be fast is that the design includes extensive preprocessing at the server end. Much of the slowness from the current site comes from the immense amount of work required in some cases to determine the colour of even a single pixel. Such pixels are always the same colour and to merely record the colour saves an awful lot of time.

On the other hand, our images are slightly more dynamic than map tiles, so some intermediate form is required which records the post-processed information. As illustrated by ADR 0006, there are additional benefits to recording information in a heavily denormalised format, as close to visual as practically possible.

Lookup of this data is primarily along discrete axes (track, chromosome, species etc), but also continuously in position and scale. Because of the way scale is modelled, this can be considered to be a small number of discrete steps.

The delivery for this data should:

1. support the access pattern of looking up data along a one-dimensional genomic axis, along with a number of discrete axes;
2. be CDN friendly;
3. be easily cacheable;
4. support data-blobs (a consequence of using a bytecode, see ADR0006).

There are a number of solutions in this area. As well as desirables for the final product, we should take care not to expend more energy than necessary in this area, particularly while we are experimenting.

There are a number of file common bioinformatics file formats which handle this kind of access pattern reasonably cleanly. Major advantages include:

1. They are very quick to implement;
2. At least initially, they are useful for experimentation as they are easily processed and inspected by standard tools in multiple environments;
3. Caching uses the operating system cache, which is the best-in-the-business for rightsizing according to resource availability;
4. The API is a familiar one in terms of modelling requests.

However, problems include:

1. They are typically heavily modelled and not easily adapted to pre-processed blobs;
2. They don't handle the discrete axes (multiple datasets) well and we are left instead with a mess on the filesystem;
3. they don't fit well with the rest of the system. (However, we've seen that this is fundamentally different data to the rest of the system and with different access patterns, so that's not overly surprising).

## Decision

The cheapness of the implementation makes files easy to start with even if we entertain the possibility of changing later. Filesystems are not a good way of organising the different discrete axes, so a database to manage these visible through a service would make a lot of sense. This would greatly reduce the need to rely on filenames and directory structure. This can be developed independently.

As long as a technology can emulate a "big" file in providing random-access to a byte-array with indexing and efficient caching, there is no reason not to migrate to it in time, particularly if it helps solve the issue of the discrete axes. There are a lot of systems in this space. The API would remain the familiar file-like API.

To allow this to happen, we must be careful not to rely on idiosyncracies of the POSIX file API (permissions, locks, owners, etc), but restrict ourselves to a minimal easily-migratable subset. Essentially, anything that supports an HTTP GET with Byte-Range requests efficiently (and does so with effective caching) should be a plausible candidate.


## Consequences

When the metadata database is in place, handling the discrete axes, we should look to see if we can or should migrate that schema and data, and perhaps the backing data itself to a more fully-featured data management technology.

