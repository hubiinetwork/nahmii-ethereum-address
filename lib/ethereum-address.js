'use strict';

const {Binary} = require('bson');

const _address = new WeakMap();

function strip0x(str) {
    return str.replace(/^(0x)+/i, '');
}

class EthereumAddress {
    constructor(address) {
        if (address instanceof Buffer && address.length === 20)
            _address.set(this, address);
        else if (address instanceof EthereumAddress)
            _address.set(this, address.toBuffer());
        else
            throw new TypeError('address is not a supported type');
    }

    static from(input) {
        switch (typeof input) {
        case 'string':
            if (input.match(/^(0x)?[0-9A-F]{40}$/i))
                return new EthereumAddress(Buffer.from(strip0x(input), 'hex'));
            else
                return null;
        case 'object':
            if (typeof input.read === 'function' && typeof input.length === 'function' && input.length() === 20)
                return new EthereumAddress(input.read(0, 20));
        }
        return null;
    }

    toString() {
        return '0x' + _address.get(this).toString('hex');
    }

    toBuffer() {
        return _address.get(this);
    }

    toBinary() {
        return new Binary(_address.get(this));
    }
}

module.exports = EthereumAddress;
