---
title: "Storage and Retrieval"
chapter: 3
date: "2026-08-12"
summary: "About storing and retrieving data; different index structures; and OLTP vs Analytical Databases/Data Warehouses."
---

* Fundamentally, a database must do two things:
  * Store the data when you give it data
  * Give the data back when you ask for it later
* Teams likely won’t need to implement a storage engine from scratch, but selecting the appropriate one is important.

## Intro to Index Structures
* Log: append-only data file/sequence of records
* Index: additional structure derived from primary data. Typically doesn’t affect content of database, just the performance of queries.
  * An index will slow down writes bc it needs to be updated every time data is written, but it speeds up read queries
* Hash index: used for key-value data (key-value stores are similar to *dictionary* type; these are usually implemented as a hash map)
  * How do you avoid running out of disk-space? By breaking log into segments of a certain size; when you reach that size, subsequent writes are made to a new segment file. Then you can do compaction: throwing away duplicate keys in the log, and keeping only the most recent update for each key.
  * For consideration:
    * Tombstone: append a special deletion record to the data file; tells merging process to discard any previous values for the deleted key
    * Crash recovery: bitcask speeds up recovery using a nsapshot of each segment’s hash map on disk
    * Concurrency control: tend to only have one writer thread since writes are appended in sequential order
  * Benefits: much faster than random writes; easier concurrency and crash recovery
  * Downsides: hash table must fit in memory; range queries are not efficient
* **SSTables and LSM-Trees**
  * Sorted String Table/SSTable: requires sequence of key-value pairs to be sorted by key. Cannot append new key-value pairs to segment immediately, since writes can occur in any order.
    * Managing segments is simple and efficient
    * Easier to find a particular key in the file since you no longer need to keep an index of all keys in memory
    * Records can be grouped into blocks; saves disk space and reduces I/O bandwidth use
  * Lots of tree data structures that can be used, ie red-black trees or AVL trees
    * Avoid database crashing problem by keeping a separate log on disk to which every write is immediately appended. Not in sorted order; purpose is to restore memtable after a crash.
  * LSM-Tree: Log-structured Merge Tree: you make this out of SSTables that are merging in the background.
    * Data is stored in sorted order, so range queries can be efficiently performed; they can also support high write throughput
  * Lucene: indexing engine for full-text search used by Elasticsearch and Solr
  * Bloom filter: a way for storage engines to optimize access; this is a memory-efficient data structure for approximating the contents of a set. Can tell you if a key does not appear in the database, and saves unnecessary disk read for nonexistent keys
  * To determine order/timing of how SSTables are compacted and merge, can use size-tiered and leveled compaction.
* **B-Tree: most common indexing structure**
  * Standard for relational databases
  * Keeps key-value pairs sorted by key
  * Breaks databases down into fixed-size blocks or pages, traditionally 4kb in size, and read/write one page at a time
  * Each page can be identified using an address or location, allowing pages to refer to one another
  * One page is designated as the root of the B-tree; where you start when you want to look up a key in the index
  * Basic underlying write operation: overwrite a page on disk with new data
  * Branching factor: number of references to child pages in one page of the B-tree
  * Tend to have write-ahead logs to make database resilient to crashes
  * Requires careful concurrency control if multiple threads access B-tree at the same time
    * Typically done by protecting tree’s data structures with latches (lightweight locks)
* *Generally,* LSM-trees are faster for writes, B-trees are faster for reads. But to be sure, you should test systems with your specific workload.

## Other indexing structures
* Secondary indexes: often crucial for performing joins efficiently
  * Difference from key-value index is that indexed values aren’t necessarily unique. There may be many rows under the same index entry.
* Multi-column indexes: necessary if we need to query multiple columns of a table simultaneously
  * Concatenated index: combines several fields into one key by appending one column to another
  * Multi-dimensional indexes: can query several columns at once, good for geospatial data
  * Fuzzy indexes: lets you search for similar keys ex. misspelled words
* In-memory databases: for datasets that aren’t that big; some are intended for caching only, whereas others aim for durability which can be achieved with special hardware
  * They are faster bc they avoid the overhead of encoding in-memory data structures in a form that can be written to disk
  * Can also provide data models that are difficult to implement with disk-based indexes (ex. **Redis** offers a database-like interface to data structures like priority queues and sets)

## Transaction Processing VS Analytics
* Transactions: a group of reads/writes that form a logical unit
  * Historically used for commercial transactions taking place, etc making a sale, placing an order, playing employee salary
  * Access pattern: application looks up a small number of records by some key, using an index. Records are inserted or updated based on user input.
  * OLTP: online transaction processing
* Analytical queries: scans over a huge number of records, reads a few columns per record, and calculates aggregate statistics (sum, count, average).
  * Answers questions like: *total revenue of our stores in January*, or *Which baby food is most frequently purchased with diaper X?*
  * Queries are written by biz analysts, and used for biz intelligence (decision-making).
  * Called OLAP: online analytic processing
* SQL is pretty good for both
* Analytics can be run on a separate database called a data warehouse
  * This is to avoid analytic queries affecting performance of transactional databases; analysts can query as much as they like
  * OLTP tend to be highly available and low-latency bc they are critical for biz operations.
  * OLAP queries are ad-hoc, and can be expensive bc they scan large parts of the dataset, potentially affecting performance of concurrently executing transactions
* A Data Warehouse contains a read-only copy of the data from various OLTP systems in the company
  * These are extracted either through a periodic data dump, or a continuous stream of updates
  * Data is then transformed into an analysis-friendly schema, cleaned up, then loaded into the warehouse (Extract/Transform/Load or ELT process)
  * Can be optimized for analytic access patterns
  * Used for drill-down/slicing and dicing data
* Data Warehouse vs Relational OLTP database are optimized for very different query patterns
* Analytics tend to use the Stars or Snowflakes model
  * Star schema: Fact table is in the center of the schema. Each row represents an event that occurred at a particular time. Facts are usually captured as individual events.
    * Some columns in the fact table are attributes
    * Other columns are foreign key references to other tables, ie dimention tables
  * Snowflake Schema: dimensions are further broken down into subdimensions
* Typically in a data warehouse, tables are very wide (ex. >100 columns). Dimension tables can also be very wide as these contain all the metadata relevant for analysts.

## Column-Oriented Storage
* A typical DWH query only accesses 4 or 5 columns at once, even if fact tables are over 100 columns wide
* Thus: might make more sense to store all values from each *column* together instead. Hence column-oriented storage.
  * Spares you from having to load every row and filter out those that don’t meet the conditions
  * Parquet: columnar storage format that supports a document data model
* Relies on each column file containing rows in the same order
* Can further reduce demands on disk throughput by compressing data.
  * Easier because values are pretty repetitive; # of distinct values tends to be smaller than values in rows
  * Bitmap encoding is one technique useful for this
* Also good for making efficient use of CPU cycles
* Vectorized processing: opeates on chunks of compressed column data directly
* These are great for making large read-only queries more performant; it does make writes more difficult
  * Update-in-place a la B-tree isn’t possible
  * LSM-trees work though. Writes go to an in-memory store first, which are then added to a sorted structure and prepared for writing to disk.
* **Materialized aggregates**
  * ex. Count, Sum, Avg, Min, Max
  * Caching of counts or sums that queries use most often
  * Can be done by creating a *materialized view*: often defined like a standard (virtual) view, a table-like object with contents that are the results of some query
  * An MV is an actual copy of query results written to disk; a Virtual view is just a shortcut for writing queries
  * When the underlying data changes, MV must be updated bc it’s a denormalized copy of the data. Makes writes more expensive, so tends not to be used for OLTP.
  * Special case of MV: data cube or OLAP cube. Can make queries v fast bc they’ve been precomputed! BUT, not as flexible as querying the raw data. Thus you use data cubes for performance boosts for certain queries.

## Summary
* OLTP systems: user-facing, see a huge volume of requests
  * To handle load, applications only touch a small number of records in each query
  * App requests records using a key; storage engine uses index to find data for the requested key
  * Disk seek time is the bottleneck
* Data warehouses/analytic systems: tend to be used by biz analysts rather than end users
  * Handle a much lower volume of query
  * Each query is v demanding, requiring millions of records to be scanned in a short time
  * Disk bandwith tends to be the bottleneck
  * Column-oriented storage is increasingly popular for this kind
* OLTP has two main schools of thought for storage engines:
  * Log-structured: permits appending to files and deleting obsolete files, but never updates a file that has been written. Ex: Lucene, Cassandra, HBase, SStables, LSM-Trees
  * Update-in-place: treats the disk as a set of fixed-size pages that can be overwritten, B-trees.
* High level architecture of a typical data warehouse
  * Queries require sequentially scanning across a large number of rows, so indexes are less relevant. It becomes more import to encode data compactly.
  * Column-oriented storage helps achieve this goal.

## Notes from my own experience
* OLTP vs OLAP!
* Data Warehouse largely used for queries; also why the team was called “Online Analytics”
  * Tho book makes a point to say "meaning of online in OLAP is unclear, it probably means queries are not just for pre-defined reports, but explorative queries"
* Idea of joins, aggregate data, and use of Materialized Views to speed up key queries
* We always discussed that performance tradeoff and latency; how often are people running these queries? Do they really need it to be sub-second performance? How much flexibility did they need with the data/filters?
  * Interestingly we were building analytics tools for end-users too; that’s where we started, and internal analysts had different tools. There was some oeffort to merge them.
* Concurrency challenges and recovering data were things we had to deal with too. (You learn a lot by being on incidents!)
