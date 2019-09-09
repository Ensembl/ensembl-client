Zhoosh is an animation library for Rust.

It is an animation library in the sense that it interpolates between variables of various types between values but does nothing else. It is designed to be highly generic in the types it can animate which is a bit of a challenge in a strongly-typed language like Rust.

Animation specification is divided between two types. Zhoosh describes an animation in abstract:
  * the types of container values it changes;
  * the type of the value which is changing;
  * how long it should take (various limits);
  * when it should be triggered in relation to other animations in a sequence;
  * easing algorithm to shape the change;
  * a callback implementing the container type update.

ZhooshRun exists for any given instance of a Zhoosh animation and takes:
  * a Zhoosh
  * the ZhooshRun for any triggering animations in a sequence;
  * start and end values;
  * the target container.

A ZhooshRunner takes a ZhooshRun and runs it to completion on calls to step().

The easing algorthim is specified by a value in the enumeration ZhooshShape.

The operations on a type to be used as a value are specified by an instance of ZhooshOps for that type. This requires implementations of
  * interpolate, which finds intermediate values, and
  * distance, which returns the distance between two given endpoints for the purposes of "speeding up" minor animations to over the minimum speed.

Standard operations are provided for the numeric types in both linear and proportional form:
  * linear form is for distances: half way between 1 and 100 is 50;
  * proportional form is for scales: half way between 1 and 100 is 10.

