# 15. Auxiliary content infrastructure

## Status

Draft.

## Context

In order to support users of the new site, we need infrastructure that will supply help and documentation content (referred to hereafter as "auxiliary content") in a format that is easy to integrate into the React framework. This content will include the following:

* Context-sensitive help articles
* Images
* Tutorial videos
* Glossary terms fetched from the OLS REST service

## Decision

Current best practice in content management is to use a headless CMS - a backend storage which can be queried by frontend components, with a ready-made editing interface that can be used for content creation. There are many contenders in this arena, including some well-established free, open-source projects.

Most headless CMS projects store content in Markdown format. The more sophisticated ones add some capabilities we need, such as video embedding, but it seems likely that at least some content will still require writing HTML by hand.

Our final choice of CMS depends on our priorities, as there is unlikely to be any one product that fulfils all our needs.

Criteria to consider:

* Do we need version control?
* Who will be managing the CMS?
* Does it support a publication workflow?

## Consequences

Frontend developers will need to create React components that fetch the content via the CMS's API and drop it into an HTML template.
