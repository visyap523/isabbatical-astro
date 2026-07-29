---
title: "Data Models and Query Languages"
chapter: 2
date: "2026-07-29"
summary: "High-level view of different data models (document, relational, graph) and their query languages."
---

# Ch 2: Data Models and Query Languages
#ddia/chapters

### Summary
* Hierarchical model: data is one big tree
* Relational model: depicted many-to-many relationships (SQL)
* NoSQL data stores: diverged in two directions
  * Document databases: data comes in self-contained docs
  * Graph databases: anything is potentially related to everything
* Document, relational, and graph are all widely used today, good for its respective domain
* Document/graph don’t typically enforce schemas, to make it easier for applications to adapt to changing requirements. App still assumes data has structure, but is it:
  * Explicit: enforced on write
  * Implicit: assumed on read
* Each data model comes with its own query language or framework: SQL, Cypher, SPARQL, MapReduce, Datalog as some.

### Intro

* Data models matter because they affect not only how the software is written, but also how we think about the problem we’re solving.
* Most applications are built by layering one data model on top of another. For each layer, the key question is, how is it represented in terms of the next-lower layer? Example:
  * An app developer looks at the real world and models it in terms of real world objects or data structures, and APIs that manipulate those, specific to your application (people, orgs, goods, actions, money flows, etc)
  * Data structures are then expressed in general-puprose data models, like JSON/XML docs, tables in a relational database, or a graph model
  * Devs who built database then decide on how to represent the JSON/XML/relational/graph data in terms of bytes in memory, on disk or on a network. This representation allows data to be queried, searched, manipulated, and processed in various ways.
  * Lower levels involve how to represent bytes in terms of electrical currents, pulses of light, magnetic fields, and more.
* Each layer hides the complexity of the layers below it by providing a clean data model. 
* This chapter focuses on general-pupose data models for data storage and querying.

### Relational Model VS Document Model
* SQL: data is organized into relations (tables, in SQL), where each relation is an unordered collection of tuples (rows, in SQL)
* Used primarily in *business data processing*; transaction processing (ex. airline reservations, stockkeeping), batch processing (ex. payroll, reporting)
* NoSQL came up in 2010s, generally reinterpreted as *Not Only SQL.* Surfaces the need for greater scalability than relational databases can easily achieve, and specialized query operations; relational schemas can be restrictive.
* Polyglot persistence: relational databases being used alongside a broad variety of nonrelational datastores
* Object-relational mismatch: most app development is done in object-oriented programming languages, which then necessitates an awkward translational layer with relational tables. 
* Showed an example of a LinkedIn profile, which had one-to-many relationships from the user (user_id) to things like jobs and schools. Options for representation:
  * Traditional SQL: normalized representation, put jobs/schools in separate tables with a foreign key reference to users table
  * Later versions of SQL: support for structured datatypes/XML; allow multi-valued data to be stored in a single row, with support for querying/indexing inside those docs
  * Encode things like jobs/education in a JSON or XML document, store in a text column on the database, and let the app interpret its structure and content
    * Typically you can’t use the database to query for values inside that encoded column
  * If data is mostly self-contained, like a resume, a JSON doc works pretty well. Also has better locality. All data is in one place, and one query is sufficient. But you may run into issues with more complex data set-ups. 
* **Many-to-One, Many-to-Many Relationships**
  * Discussion of why it’s good to have standardized lists for things like geographic regions and industries. For consistency.
  * Storing an ID vs text field is a question of deduplication. Using an ID is good bc it has no meaning to humans. Anything that is meaningful to humans may change in the future. You want to remove duplication where possible (annoying to have to update all redundant copies and records)…hence normalization in databases.
  * Normalizing data requires many-to-one relationships which aren’t great in document models. This is where joins come in. Or you may have to make multiple queries to the database, which are slow.
  * Data also becomes more interconnected as more features are added (ex. the static record of “School” on a profile becomes a clickable entity that expands to show the school and all other students)
* **Document Databases**
  * Relational vs Network
  * Network eventually died. 
    * Links between records were like pointers in a programming language. Generalization of hierarchical model, except a record can have multiple parents.
    * Access path: following a path from a root record along a chain of links
    * CODASYL model complications around navigating n-dimensional data space
    * Died bc querying and updating data was inflexible and hard in this model.
  * Relational model, which eventually became SQL
    * Lays out all data in the open: relations/tables and tuples/rows. No complex nested structures or access paths.
    * Query optimizer automatically decides which parts of the query to execute in which order, nad which indexes to use. 
    * You only need to build a query optimizer once, and then all applications using that database can benefit.
  * TL;DR: IF the data in your application has a document-like structure (tree of one-to-many relationships, entire tree is loaded at once), then it’s a good idea to use a document model. Limitation is referring to nested stuff is hard and would require joins or multiple queries.
    * IF your data has many-to-many relationships, then maybe you want to use relational or graph models.
* **Schema Flexibility** 
  * Document models typically don’t enforce schemas. Lets you add arbitrary keys/values; when reading, clients have no guarantees as to what fields docs may contain.
  * Not actually schemaless. There’s an implicit schema, but not enforced by the database. More accurate term:
    * Schema-on-read: structure of data is implicit, and only interpreted when data is read
    * This is VS schema-on-wirte: relational database approach, where schema is explicit and database ensures all written data conforms to it
  * Pros/cons obvious when you have to change data format. 
    * In a doc database, you’d just have the code handle the case of the old doc.
    * In a relational database (statically typed), you need to perform a migration, which can be slow/require downtime. (Though there’s many ways to work around this.)
  * Schema-on-read is handy when data is heterogenous/items in collection don’t all have the same structure, ex. they’re from external systems, or there’s many types of objects
* **Data locality for queries:** locality advantage only applies if you need large parts of the doc at the same time. Database needs to load the entire doc for only a small section. And if you only need to update a part of it, you have to update the whole doc. These performance limitations reduce situations in which document databases are useful.

### Query Languages for Data
* Imperative language: tell the computer to perform certain operations in a certain order. Step through the code line-by-line, evaluate, update, decide if you loop again.
* Declarative query language (ex. SQL), just specify the pattern of the data you want, but not how to achieve the goal. Then database system’s query optimizer decides which indexes and join methods to use, and in which order to execute the query.
  * Typically more concise and easier to work with
  * Lend themselves better to parallel execution

### Graph-like Data Models
* Useful if connections within your data become more complex
* Two kinds of objects:
  * Vertices (also nodes or entities)
  * Edges (also relationships or arcs)
* Ex: social graph: vertices are people, edges are which people know each other; web graph: vertices are web pages, edges are HTML links to other pages.
* Property graph model is implemented by Neo4j, Titan, and InfiniteGraph
  * In this, each vertex consists of a unique identifier, a set of outgoing edges, a set of incoming edges, and a collection of properties (key-value pairs)
  * Graph stores contain two relational tables: one for vertices, one for edges
* Some key aspects of the model:
  * Any vertex can have an edge connecting it with any other vertex
  * Given any vertex, you can efficiently find both its incoming/outgoing edges and traverse the graph (follow a path through the chain of vertices)
  * By using different labels for different kinds of relationships, you can store several different kinds of info in a single graph, while still maintaining a clean data model
* Graphs are good for evolvability and can be extended to acommodate changes in applications data structures.

**Query languages for graph data**
* Cypher: Declarative query language for property graphs, created for Neo4j
  * Many ways of executing the query; don’t need to specify execution details
* Can you query graph data using SQL? Yes, but with difficulty. In relational you usually know in advance which joins you need. In a graph query, number of joins isn’t fixed in advance.
  * Generally the queries get much longer and more unwieldy.
* Triple-stores and SPQARL
  * Triple-store: all info is in three-part statements (subject, predicate, object)
  * Semantic web: a kind of internet-wide “database of everything,” a web of data. At the time of book’s writing, not really materialized. But maybe this is different now? Book posits the triples can be a good internal data model for applications.
  * RDF data model: designed for internet-wide data exchange
  * SPARQL query language is for triple-stores using RDF data model
* Brief discussion of Datalog approach; rules can be combined and reused in different queries. Not good for one-offs, but maybe better if data is complex.

---

### Notes from my own experience
* Relevant to lots of things we built.
  * Issues of JSON blob and wanting to promote certain relevant fields (query nested data or second-level data)
  * That tradeoff of flattened/fast VS oh you have to make multiple queries, or else invent a system that supports joins
* That question of joins/latency was very important for the analytical projects we were building
* Some interest in moving to graph data (lots of data, all connected to each other) but that would’ve been a significant undertaking 
* Gives context to the many data migrations we underwent due to updates in the data format