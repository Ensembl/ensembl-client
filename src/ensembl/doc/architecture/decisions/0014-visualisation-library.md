# 14. Visualisation Library

Date: 2019-11-21

## Status

Accepted

## Context

While we have a powerful data visualisation tool already in the form of the new genome browser, we have many additional visualisation requirements, particularly in Entity Viewer. These will need to show not only biological objects such as transcripts but also graphs, trees and other complex interactive diagrams.

Developing these types of views by extending the genome browser would be very labour-intensive, since everything would have to be written from scratch. We therefore need a separate library/codebase that will enable us to create a wide variety of custom visualisations, with or without animations and interactivity.

## Decision

There are two clear alternatives:

* Use an existing visualisation library
* Create our own, using plain vanilla SVG and JS

The former has the advantage of requiring far less development up front, especially if we choose one with functionality that we know will be needed, such as graph types and animations. It may however have a steeper learning curve.

While there are many JS-based visualisation libraries out there, most are either proprietary or very limited in scope (or both). For Ensembl, we need the ability to create custom visualisations, not just graphs and charts.

We have therefore settled upon D3, for a number of reasons:

**1) It is a well-established library**

D3 has been around since 2011, and is still under active development. It has a large user community, and learning resources (books, tutorials and online courses) are readily available.

**2) Modular structure**

Although formerly monolithic, D3 has now been split into many small modules, each with a specific function. This allows us to only use the parts we need, rather than importing a massive library.

**3) Integration with React**

D3 offers a variety of ways to integrate with React, from "black box" implementations similar to the genome browser, to using individual D3 modules to calculate scale, etc but rendering the image in the React DOM or even on a canvas. This gives us a great deal of flexibility in how we use it.

**4) Developer familiarity**

We have already used D3 in developing some of our standalone widgets, and can apply that experience to work on the new site.

## Consequences

D3 will help us to create custom visualisations for both existing designs and future ones. We would not need to hand-craft every feature from scratch, but could integrate D3 in various ways to meet the requirements of individual components.

We are aware that integrating D3 with React does not give an obvious route for exporting the visualisations for use in other resources, within EBI or externally. We do not consider this a significant enough limitation to affect our decision to use it.
