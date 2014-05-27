#Introduction
Speech.js is a JavaScript interoperability mechanism for Namecoin domains.  

This is the development bundle for Speech.js, with it you can produce spx.js and babel.js; the versions of Speech.js
used in actual deployment.

The system is very slow as simplicity and clean code has been emphasized at each engineering point.  This is intentional
as it is the hopes of the author that just as multiple desktop browser implementations compete on performance and fea-
tures, multiple in-browser implementations will arise to compete on performance and features as well. Consider Speech.js
to be the Moziac of in-browser browsers: an early, proof-of-concept example for others to improve upon.

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