# 17. Use IndexeddB for in-browser data storage

Date: 2021-09-06

## Context
The new Ensembl website needs to persist certain user data (e.g. selected species, list of up to 200 previously viewed genes, incomplete and unsubmitted contact form) between browser sessions — i.e. if the user closes and then re-opens a web browser tab or the whole web browser instance.

## Available options for client-side persistence of data
In absence of user accounts and associated server-side storage of user data, we can only store the data in the browser itself. The browser provides the following options for long-term data storage:

- Cookies
- LocalStorage
- IndexedDB

Cookies can only store up to 4kB of data, and should therefore be restricted sparingly, and only for communication between the browser and the server. LocalStorage is a very simple key-value storage for web browsers, which can only store strings and whose overall storage capacity is typically limited to 5-10MB of data. IndexedDB is the most powerful storage option: it is a noSQL-type database built into the browser that can store all javascript data types that can be copied using [the structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm), including files.

The following is a brief comparison of LocalStorage and IndexedDB:

| Browser API            | LocalStorage  | IndexedDB
| ---------------------  | ------------- | -------------
| Year released          | ~ 2009        | ~2012
| Type of storage        | key-value     | noSQL database
| Types of stored values | strings       | various, including files
| Kind of api            | synchronous   | asynchronous
| Maximum storage size   | 5-10MB        | variable, potentially multiple gigabytes
| Access from workers    | no            | yes

## Strengths of IndexedDB
There are several features of IndexedDB that make it a particularly attractive storage option:
- It is a real database that can have multiple object stores for different data models. As opposed to LocalStorage, it natively supports versioning, which should encourage a more disciplined approach to evolving of our data models (i.e. every breaking change will result in a version bump).
- It has an asynchronous api, which prevents the blocking of browser's main thread during the saving and the retrieval of data. In contrast, LocalStorage has a synchronous api, which makes it possible for it to block browser's main thread if data transformation to/from strings takes a long time.
- It has a large storage capacity. Effectively, it can grow as large as there is free space on the disk available to the web browser (roughly up to 80% of free disk space). In practice, this means that it can potentially store gigabytes of data.
- It is accessible not only from the main thread, but also from workers.

The above characteristics make IndexedDB the preferred option of client-side data storage in modern web development. For example, Google [recommends](https://web.dev/storage-for-the-web) web developers to always pick IndexedDB for the storage of any client-side data other than browser-cached network requests. 

Unfortunately, IndexedDB was released several years before javascript acquired the Promise object for ergonomic control of asynchronous operaitons. Because of that, IndexedDB's api, which is based on event listeners and callbacks, is notoriously clunky. A tiny third-party library `idb` addresses this problem by wrapping IndexedDB into a more convenient promise-based api. It is generally recommended that web developers use IndexedDB with the `idb` library.

## The immediate reason to use IndexedDB for the new Ensembl site
This ADR is being proposed as we are introducing the Contact Us form. It has been decided that, for usability reasons, user data entered into the form should persist between sessions until the user submits the form, so that, if the user closes the form or accidentally closes the browser tab with the form altogether, the data already entered into the form would remain when the form is re-opened. It has also been decided that the form can include attachments, and the total size of the attachments can be up to 10MB. This last requirement alone makes it impossible for us to store the form data in LocalStorage.

In the future, it may be worth following Google's advice and switch from LocalStorage to IndexedDB entirely.

## Decision
1. Immedicate: Use IndexedDB to store large (over 1MB) client-side data.
2. Long-term: Consider migrating the data we keep in LocalStorage over to IndexedDB.

## Consequences
IndexedDB has a more complex api than LocalStorage, which will require from us more care when working with it. Specifically:

- We will need to remember to bump the database version when updating or adding data models that we want to store in the browser. We will need to keep in mind that, once created in the user's browser, the database stays there for a long time; so when we decide to add an object storage to the database, that will require  a version bump, because otherwise, users who have already visited the Ensembl site and have initialized an older version of IndexedDB, will not get this object storage added to their existing database. Note that database version can only be changed forwards, i.e. if the current database version is 2, the next version is not allowed to be 1.
- We will need to be aware of a possible unhappy path when dealing with IndexedDB. On a device with little disk space remaining, a call to IndexedDB can result in an error.
- Safari is known to break IndexedDB (for example, there is a bug in Safari, both desktop and iOS version, that prevents the immediate use of IndexedDB when the browser is opened). We hope that this will not be a significant concern in the future. Also, to be fair, Safari is also known to have broken LocalStorage.

## To consider
There exists a small library, [idb-keyval](https://www.npmjs.com/package/idb-keyval), which provides a simple API to use IndexedDB just as a key-value storage, combining the simplicity of LocalStorage with the power of IndexedDB (asynchronicity and different data types). It removes the complexity of managing IndexedDB; however, in our case that would return us to the question of how to handle updatets to the schemas of stored data, which can otherwise be solved through IndexedDB versioning. 


## References

### Articles for web developers by Google
- [Storage for the Web](https://web.dev/storage-for-the-web/)
- [Best Practices for Using IndexedDB](https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/indexeddb-best-practices)

### Other resources
- [MDN article on IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
