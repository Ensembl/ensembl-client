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

## Decision

Current best practice in content management is to use a headless CMS: a backend content store with a ready-made editing interface that can be used for content creation.

The three leading open-source projects were considered but ultimately rejected. NetlifyCMS is an admin layer over a GitHub repository, which is good for content creation but not so efficient for content retrieval. Ghost has an efficient content API but is heavily oriented towards blogging. Strapi was the closest to what we need, but is a very new product and still lacks some features that would make for a smooth experience for both developers and content providers.

A commercial PaaS (Platform as a Service) CMS, on the other hand, is likely to have a much fuller feature set and also greatly reduce developer time and effort. However most of the ones researched were very expensive: $500 or more per month for the level of service we require, with possible additional costs if bandwidth usage turned out to be higher than anticipated. Only one product stood out as being within our budget.

Prismic is a simple but fully featured headless CMS that offers a variety of inexpensive packages, including a free single-user account that could be used for initial development.

### Features
* Customisable user interface
* Draft, live and archived content status
* Revision history
* React API, including search capability
* Ability to preview pages directly in our apps

The Professional Medium package costs $100 per month, and provides:
* 25 users
* User roles
* Publication workflow
* SLA with 99.5% uptime and basic support

Note that we would not be able to have individual user accounts for everyone in Ensembl on this package. Regular users like web FE and Outreach would need them, but other teams would have to have a shared team account.

(The Platinum package has slightly better terms and unlimited users, but costs $500 per month.)

## Consequences

### Pros

* Using a headless CMS will allow us to pull content into the Ensembl client and organise it in any way we see fit

* Content providers will be able to write documentation, tutorials, etc using a familiar web interface, similar to the WordPress dashboard

* Prismic's rich text editor can be customised to limit the formatting options allowed, which will reduce the tendency for our static content to vary wildly in styling and appearance

### Cons

* Tying ourselves into a paid service will make it impossible for us to distribute this content to external users setting up a local mirror, so our code will need to fall back to placeholder content if a service is not configured

* Initial setup will be required for the Prismic admin interface before it can be used by content providers
