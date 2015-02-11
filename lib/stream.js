"use strict";

const bl = require('bl');
const util = require('util');
const Transform = require('stream').Transform;
const header = require('./header');

util.inherits(RPMStream, Transform);

/*
  states:
   0 initial
   1 lead detected
   2 ....
   3 content
   -1 error
*/

function RPMStream(options) {
  if (!(this instanceof RPMStream))
    return new RPMStream(options);

  Transform.call(this, options);
  this._state = 0;
  this._buffer = bl();
}

RPMStream.prototype._transform = function(chunk, encoding, done) {

  // accumulate
  const b = this._buffer;
  b.append(chunk);

  try {
    do {
      switch (this._state) {
        case 0:
          if (b.length >= header.LEAD_LENGTH) {
            const lead = header.readLead(b.slice(0, header.LEAD_LENGTH));

            // we are shure to have consumed the lead
            b.consume(
              header.LEAD_LENGTH);
            this._state = 1;

            this.emit('lead', lead);
          }
          break;
        case 1:
          if (b.length >= header.headerStructureHeaderLength) {
            const h = header.readHeader(b.slice(0, header.headerStructureHeaderLength));

            console.log("header: " + JSON.stringify(h));

            b.consume(
              header.headerStructureHeaderLength);
          }
          break;
      }
    }
    while (this._state !== 3);
  } catch (e) {
    this.emit('error', e);
    this._state = -1; // TODO and now ?
    done();
    return;
  }

  this.push(chunk);

  done();
};

module.exports = RPMStream;