A genome browser is a means of representing biology visually. Unlike, for example, a two-dimensional work of art, this representation is indirect and abstract.

At some point in developing a genome browser, decisions need to be made regarding the appropriate representation of that biology (and those decisions operationalised in configuration and code).

It is hard to get this transformation right. Excessively naive, or reductionist approaches to this transformation tend to lead to:

  1. information overload;
  2. lack of guided priority of user focus;
  3. confusingly repeated information;
  4. poorly-aggregated information;
  5. strategies which fail to be effective across the full variety of instances to which they are applied;
  6. accidental introduction of bias;
  7. failure for data to be useful across audiences;
  8. failure to communicate ambiguity, contingency, or lack of knowledge;
  9. failure to communicate responsibilty, provenance, evidence, history;
  10. failure to handle outliers;
  11. etc.

These are all issues which ensembl and the broader community face. They amount to at least one profession and one which cannot be replaced by an algorithm. This means that as a project we are going to be faced codifying a large, messy body of knowledge, algorithms, etc, which are the project's attempt to address the issues above because direct, unmapped, "clean" approaches are likely to fail some of the points above and evolve into messes.

We can expect this transformation:

  1. to use and synthesise a wide variety of data sources and access methods;
  2. to include both pre-computed and just-in-time data;
  3. to lack any completely consitent one-to-one mapping between the visual language and the project organisation or object-relational model used by any given source;
  4. to evolve over time and be as tied to the dataset concerned as the individual realisation of the site;
  5. to require quality-control and modification immediately after data-generation;
  6. to require a tightly-iterative practice.

For just-in-time data we can expect:

  1. a certain amount of synthesis which will probably require caching or just-in-time computation;
  2. a wide variety of file-formats, APIs, languages, etc;
  3. inclusion of restricted data according to inter-project agreement;

For pre-computed data we can expect:

  1. sufficient volume of data that transferring and storing it can be a valid architectural concern;
  2. datasets which include restricted data.

These concerns speak against an architecture which implements the required representational transformation within the browser, having been "delivered biology". We are left with two options:

  1. "pre-computation" of _visual_ information during release by the application of the 


We need our means of capturing this transformation:

  1. to be richly expressive;
  2. to support a wide range of software environments to avoid architecture lock-in when considering third-party code;
  3. to run in a powerful environment;

   1. allow this transformation to be richly expressive;

   2. allow the transformation to run in a powerful and well-connected environment;

   3. push as much of it as needed "up" to those with a scientific and bioinformatic background who can make the correct decisions based on the data;

   4. push as much of it as needed "up" to designers, production, and outreach staff who have knowledge of user need;
   
