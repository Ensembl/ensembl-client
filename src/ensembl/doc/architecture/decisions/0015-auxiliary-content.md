# 15. Auxiliary content infrastructure

## Status

Draft.

## Context

In order to support users of the new site, we need infrastructure that will supply help and documentation (referred to hereafter as "auxiliary content") in a format that is easy to integrate into the React framework. This content will include the following:

* Context-sensitive help articles
* Longer articles, e.g. technical documentation
* Tutorial videos
* FAQs

**Exception**: glossary terms will be fetched direct from the OLS or made available via a backend micro-service similar to other biological data.

### Required features

* User-friendly editing interface
* Flexible, customisable content templates (not just monolithic pages)
* Media support, e.g. image uploads
* Efficient fetching of content for embedding in the client
* Data stored in a format that allows it to be easily consumed by our React components
* Free and open-source
* Based on modern technologies - JAMstack, not LAMP

## Decision

Current best practice in content management is to use a headless CMS - a backend content store with a ready-made editing interface that can be used for content creation. There are many contenders in this arena, but few that fulfil all our requirements.

Two projects that were considered but ultimately rejected were NetlifyCMS and Ghost. NetlifyCMS is an admin layer over a GitHub repository, which is good for content creation but not so efficient for content retrieval.
Ghost, on the other hand, has an efficient content API but is heavily oriented towards blogging and might be difficult to repurpose for our needs.

Strapi (https://strapi.io/), though a relative newcomer, seems to offer the best of both worlds. It is a Node/React app that uses either MySQL/MariaDB or SQLite as its backend, and its record templates are entirely customisable. Text content is stored as Markdown, and records can be fetched as JSON using either REST or GraphQL. Strapi integrates well with many modern JS frameworks, including both vanilla React components and the Gatsby static site generator.

## Consequences

### Pros

* Using a headless CMS will allow us to both pull content into the Ensembl client and, if desired, run a separate "documentation" website from the same backend.

* Content providers will be able to write documentation, tutorials, etc using a familiar web interface, similar to the WordPress dashboard

* Storing content as Markdown will reduce the tendency for our static content to vary wildly in styling and appearance

* Markdown-to-HTML converters are readily available for React

### Cons

* There is always a learning curve with unfamiliar technologies

* Strapi is a relatively new project

* Initial setup will be required for the Strapi admin interface before it can be used by content providers

* For anything other than contextual help (which will need its own React components integrated into our apps), some development work will be needed to display content as web pages - either within the Ensembl client or as part of a third-party frontend such as Gatsby.
