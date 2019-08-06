'use strict';

const { Binary } = require('bson');

const regex0x = /^(0x)+/i;
const regexHex = /^(0x)?[0-9a-f]+/i;

const _buffer = new WeakMap();

function hexFromUInt (input) {
    let str = input.toString(16);
    if (str.length % 2)
        str = '0' + str;
    return str;
}

function bufferFrom (input) {
    if (typeof input === 'string' && (input.length % 2) === 0 && input.match(regexHex))
        return Buffer.from(input.replace(regex0x, ''), 'hex');
    if (input instanceof Buffer)
        return Buffer.from(input);
    if (input && typeof input.read === 'function' && typeof input.length === 'function')
        return input.read(0, input.length());
    if (typeof input === 'number' && Number.isInteger(input) && 0 <= input)
        return Buffer.from(hexFromUInt(input), 'hex');
    return null;
}

function stageOwnership (newBuffer) {
    _buffer.set(newBuffer, newBuffer);
}

function acquireOwnership (newBuffer) {
    _buffer.set(this, newBuffer);
    _buffer.delete(newBuffer);
}

class NahmiiBinary {
    constructor(input) {
        if (input instanceof Buffer) {
            if (_buffer.has(input))
                acquireOwnership.call(this, input); // Ref
            else
                _buffer.set(this, Buffer.from(input)); // Copy
        }
        else if (input instanceof NahmiiBinary) {
            _buffer.set(this, _buffer.get(input)); // Shared ref
        }
        else {
            throw new TypeError('Argument must be NahmiiBinary or a buffer.');
        }
    }

    get length() {
        return _buffer.get(this).length;
    }

    toBuffer() {
        return Buffer.from(_buffer.get(this));
    }

    toString() {
        return '0x' + _buffer.get(this).toString('hex');
    }

    toBinary() {
        return new Binary(_buffer.get(this));
    }

    isEqual(that) {
        if (!(that instanceof NahmiiBinary) && (that !== undefined) && (that !== null))
            that = NahmiiBinary.from(that);
        return !!that && _buffer.get(this).equals(_buffer.get(that));
    }

    static from(input) {
        if (input instanceof NahmiiBinary)
            return new NahmiiBinary(input);

        const newBuffer = bufferFrom(input);

        if (newBuffer) {
            stageOwnership(newBuffer);
            return new NahmiiBinary(newBuffer);
        }

        return null;
    }

    static assertInstance(obj) {
        if (!(obj instanceof NahmiiBinary))
            throw new TypeError('Object must be an instance of NahmiiBinary');
    }
}

module.exports = NahmiiBinary;
