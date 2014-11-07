#Introduction
Speech.js is a JavaScript interoperability mechanism for Namecoin domains. It powers [Speech.is](https://www.speech.is).

This repo is in a state of flux as I am refactoring the meta-aspects of the project such as the server setup & babel.js.

If you want to play around, stick to items in src and dist. The SPX submodule will be removed entirely.

#Breakdown
The structure of the program is relatively OO and breaks down into functional network components.  The meat of the
system lies in the `dns` and `nav` scripts.


## DNS
DNS essentially reimpliments the DNS layer of the networking stack.  Currently, it relies on a traditional client/server
model as the TPP has not yet been passed and it is still safe to provide DNS information directly.  Speech.is runs a VM
with a script known as [nmc2couch](https://github.com/indolering/nmc2couch) which pushes Namecoin domain data to a 
CouchDB instance.  Using the internal network, the original CouchDB instance replicates to another CouchDB install on a
public-facing VM.

There is a thin abstraction layer build on top of PouchDB, but most of it translates into get requests. Upon loading,
speech.js creates a connection to the CouchDB server and begins replicating.

The system was originally designed to have many different publishes/mirrors, to allow for per-website over-rides.  Thus,
 if a user is in a censored country, they could register a webhook would would offer up a custom entry point.  It is 
unclear if this ist he correct layer of abstraction for personalized entry points, but it remains in the system for now.

Eventually, this will be replaced by a browser/WebRTC-based P2P network.  This was not implemented in the initial phase
to allow browser-based P2P networks and Bitcoin/Namecoin UTXO/SCIP lite-clients time to mature.

## Nav
Navigation essentially manages the addresses bar and the history state.  This is the least functional component of the
system, largely because it leaves functionality in-tact while irritating potential developers who might be driven to
scratch an itch and contribute back to the project.

## Config
Config should be replaced with [Puton](https://github.com/speech/speech.js/issues/22).

## Misc
The other libraries are fairly short.  PR's explaining them in better detail are welcomed.

# Package Management

NPM and Bower are used in this project:

* NPM is used for developer package management: mocha, gulp, memdown, leveldb, etc.
* Bower is used for client-side asset management: PouchDB, Ready.js, JQuery, etc.

Items packaged for Bower are generally packaged for use within a web browser wheras NPM packages are generally designed
for use within Node.js. Bower is strictly used to manage assets, not for dependencies nor anything else.  This enables
Speech.js, spx, and babel.js to reference specific items in each of those packages without having to take on the entire
 install.

NPM helps to manage the complex machinery that is the compiler along with all of it's dependencies.