# 15. Auxiliary content infrastructure

## Status

Draft.

## Context

In order to support users of the new site, we need infrastructure that will supply help and documentation (referred to hereafter as "auxiliary content") in a format that is easy to integrate into the React framework. This content will include the following:

* Context-sensitive help articles
* Arbitrarily organised and nested web pages, e.g. technical documentation
* Tutorial videos

**Exception**: glossary terms will be fetched direct from the OLS or made available via a backend micro-service similar to other biological data.

### Required features

* User-friendly editing interface
* Flexible, customisable content templates (not just monolithic pages)
* Media support, e.g. image uploads
* Efficient fetching of content for embedding in the client, e.g. through a REST API
* Data stored in a format that allows it to be consumed by our React components
* Free and open-source

## Decision

Current best practice in content management is to use a headless CMS - a backend content store with a ready-made editing interface that can be used for content creation. There are many contenders in this arena, including some well-established free, open-source projects, but no one product is likely to fulfil all our requirements.


## Consequences

* Most headless CMS projects store content in Markdown format, which does not direcly support tables, video embedding, etc, so it seems likely that at least some content will still require writing HTML by hand. However large tables are probably better served through custom React components rather than static content.

* Frontend developers will need to create React components that fetch the content, parse any Markdown and drop it into an HTML template.
