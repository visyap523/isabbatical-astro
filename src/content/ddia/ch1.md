---
title: "Reliable, Scalable, and Maintainable Applications"
chapter: 1
date: "2026-07-24"
summary: "Introduces the three core concerns of data-intensive applications and the standard building blocks used to address them."
---

## Overview

* Mostly an intro to these three terms and why they're so important to data-intensive applications (where data is usually the main challenge)
* Typically a DIA is built from standard building blocks that provide commonly needed functionality
  * Databases: store data so they can be found again later
  * Caches: remember the result of an expensive operation, to speed up reads
  * Search indexes: allow users to search data by keyword or filter in various ways
  * Stream processing: send a message to another process to be handled async
  * Batch processing: periodically crunch a large amount of accumulated data
* Data systems: can be made up of one tool that is stitched together using application code
  * Typically you make an API to hide the implementation details from the client
  * You've made a new, special-purpose data system from smaller, general-purpose components
* Three key concerns for DIA

## Reliability

* Working correctly even when things go wrong
* Could be hardware, software, or human faults
  * Reducing human errors: sandbox environments; design in such a way that errors are minimized; test thoroughly at every level; set up detailed and clear monitoring (performance metrics, error rates) ie telemetry; implement good management practices and training

## Scalability

* Ability to cope with increased load; if our system grows in this way, what are our options for coping with that growth?
* We first need to succinctly describe current load on the system; *then* we can discuss growth questions (ie what happens if the load doubles)
  * Load parameters are numbers to describe that growth. Can be rps, read/write ratios, hit rate on a cache, etc.
  * Discusses Twitter as an example — Twitter's scaling volume isn't tweet volume but **fanout**: each person is followed by many users, and each user follows many people. Derived from an EE term: describes the number of logic gate inputs that are attached to another gate's output.
  * Ultimately Twitter did a hybrid approach: most users' tweets are fanned out to home timelines when posted, but users with a huge number of followers are excepted from the fanout.
* Generally, asking about *when you increase a load parameter, how much do you need to increase resources to keep performance unchanged?*
* In a batch processing system we care about **throughput**: number of records we can process per second / total time it takes to run a job on a dataset of a certain size
* In an online system we care about **response time** (often used synonymously with latency): time between a client sending a request and receiving a response
* Some discussion of taking a median value, and then percentiles on response times, which are used for SLAs and SLOs
* To cope with load:
  * **Scale up**: vertical scaling, move to a more powerful machine
  * **Scale out**: horizontal scaling, distribute load among many smaller machines
* Normally you'd work with a mix. Intensive workloads often can't avoid scaling out.
* There's also elastic vs manual systems; the benefit of manual is it's simpler and also has fewer surprises.
* Architectures for scaling are built around assumptions around key operations; those need to be correct — they determine your load parameters.

## Maintainability

* Ongoing maintenance: fixing bugs, keeping systems operational, investigating failures, adopting to new platforms, modifying for new use cases, repaying technical debt, adding new features
* Three design principles:
  * **Operability**: make life easy for operations. Monitoring, ability to track system failures/degraded performance, security patches, understand how systems affect each other, etc.
  * **Simplicity**: managing complexity. Tight coupling of modules, tangled dependencies, inconsistent naming/terminology, hacks for special-cases, etc. One fix is abstraction; good ones hide implementation details and can be used for a wide variety of applications.
  * **Evolvability**: make change easy. Agile is suggested here as a method. It lets you modify a data system and adapt to changing requirements more easily.