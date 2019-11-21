# 14. Visualisation Library

Date: 2019-11-21

## Status

Pending

## Context

While we have a powerful data visualisation tool already in the form of the new genome browser, we have many additional visualisation requirements, particularly in Entity Viewer. These will need to show not only biological objects such as transcripts but also graphs, trees and other complex interactive diagrams.

Developing these types of views by extending the genome browser would be very labour-intensive, since everything would have to be written from scratch. We therefore need a separate library that will enable us to create a wide variety of custom visualisations, with or without animations and interactivity.

## Decision

There are two clear alternatives:

* Use an existing visualisation library
* Create our own, using plain vanilla SVG and JS

The former has the advantage of requiring far less development up front, since widely-used elements such as graph types and animations will be included, though admittedly there may be a steeper learning curve.

Also, while we could use both approaches in parallel, e.g. SVG for a static image and a library for images with interaction, this could quickly lead to duplication of code and/or the need to rewrite components if we wanted to add interactivity.

### Suggested solution

While there are many JS-based visualisation libraries out there, most are either proprietary or very limited in scope (or both). For Ensembl, we need the ability to create custom visualisations, not just graphs and charts.

We are therefore considering D3, for a number of reasons:

**1) It is a well-established library**

D3 has been around since 2011, and is still under active development. It has a large user community, and learning resources (books, tutorials and online courses) are readily available.

**2) Wide range of built-in functionality**

D3 includes many modules we already know we will need, such as:

* shapes
* graph axes
* zooming

as well as many others that could be useful in future.

https://github.com/d3/d3/wiki/Gallery

**3) Integration with React**

This has already been proven through development of standalone widgets such as TVV.

Caveats:
* D3's DOM-handling functions can potentially clash with those of React, but this can be avoided by creating an SVG container as a "black box" within which D3's drawing and animation methods are called
* We would then need to create functions to allow the React framework to communicate with D3, similar to the way we pass information to the genome browser

**4) Developer familiarity**

We have already used D3 in developing the TVV widget, which is a visualisation we may decide to reimplement in the new site. We therefore have existing working code that we can draw upon when creating our new components.

## Consequences

This library will help us to create custom visualisations for both existing designs and future ones. We would not need to hand-craft animations or develop code to draw bar charts, scatter plots, etc, but could focus our efforts on those aspects unique to Ensembl, such as drawing meaningful visualisations of biological entities.
