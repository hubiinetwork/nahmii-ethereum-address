'use strict';

const NahmiiBinary = require('./nahmii-binary');

class EthereumAddress extends NahmiiBinary {
    constructor(input) {
        if (input instanceof NahmiiBinary && input.length === 20)
            super(input);
        else
            throw new TypeError('Argument must be of type EthereumAddress or NahmiiBinary');
    }

    static from(input) {
        const binary = NahmiiBinary.from(input);
        return binary && binary.length === 20 ? new EthereumAddress(binary) : null;
    }

    static assertInstance(obj) {
        if (!(obj instanceof EthereumAddress))
            throw new TypeError('Object must be an instance of EthereumAddress');
    }
}

module.exports = EthereumAddress;
