'use strict';

const NahmiiBinary = require('./nahmii-binary');

class EthereumHash extends NahmiiBinary {
    constructor(input) {
        if (input instanceof NahmiiBinary && input.length === 32)
            super(input);
        else
            throw new TypeError('Argument must be of type EthereumHash or NahmiiBinary');
    }

    static from(input) {
        const binary = NahmiiBinary.from(input);
        return binary && binary.length === 32 ? new EthereumHash(binary) : null;
    }

    static assertInstance(obj) {
        if (!(obj instanceof EthereumHash))
            throw new TypeError('Object must be an instance of EthereumHash');
    }
}

module.exports = EthereumHash;
