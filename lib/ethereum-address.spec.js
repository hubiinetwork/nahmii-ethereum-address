'use strict';

const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const {Binary} = require('bson');
const EthereumAddress = require('./ethereum-address');
const NahmiiBinary = require('./nahmii-binary');

function strip0x(str) {
    if (!str)
        return str;
    if (typeof(str) !== 'string')
        return str;

    return str.replace(/^(0x)+/i, '');
}

const given = (precondition, fn) => describe (precondition, fn);
const when = (operation, fn) => describe (operation, fn);

const validHexData = '0x0011223344556677889900112233445566778899';
let binary;

function it_is_a_valid_EthereumAddress_instance () {
    it ('asserts as a EthereumAddress instance', () => {
        expect(() => EthereumAddress.assertInstance(binary)).to.not.throw();
    });
    it ('is convertible to a hex string', () => {
        expect(binary.toString()).to.eql(validHexData);
    });
    it ('is convertible to a buffer', () => {
        expect(binary.toBuffer()).to.eql(Buffer.from(strip0x(validHexData), 'hex'));
    });
    it ('is convertible to a BSON Binary', () => {
        expect(binary.toBinary()).to.eql(new Binary(Buffer.from(strip0x(validHexData), 'hex')));
    });
    it ('equals itself', () => {
        expect(binary.isEqual(binary)).to.be.true;
    });
    it ('equals a EthereumAddress of same value', () => {
        expect(binary.isEqual(EthereumAddress.from(validHexData))).to.be.true;
    });
    it ('does not equal a EthereumAddress of different value', () => {
        expect(binary.isEqual(EthereumAddress.from(validHexData.replace('0', '1')))).to.be.false;
    });
    it ('does not equal an object of different type', () => {
        expect(binary.isEqual(validHexData)).to.be.false;
    });
    it ('does not equal an undefined value', () => {
        expect(binary.isEqual(undefined)).to.be.false;
    });
    it ('does not equal null', () => {
        expect(binary.isEqual(null)).to.be.false;
    });
    it ('has correct length', () => {
        expect(binary.length).to.eql(20); // Bytes
    });
}

given ('a EthereumAddress created from a EthereumAddress', () => {
    when ('using the constructor', () => {
        beforeEach(() => {
            const otherBinary = EthereumAddress.from(validHexData);
            binary = new EthereumAddress(otherBinary);
        });
        it_is_a_valid_EthereumAddress_instance();
    });

    when ('using the from() factory', () => {
        beforeEach(() => {
            const otherBinary = EthereumAddress.from(validHexData);
            binary = EthereumAddress.from(otherBinary);
        });
        it_is_a_valid_EthereumAddress_instance();
    });
});

given ('a EthereumAddress created from a NahmiiBinary', () => {
    when ('using the constructor', () => {
        beforeEach(() => {
            const nahmiBinary = NahmiiBinary.from(validHexData);
            binary = new EthereumAddress(nahmiBinary);
        });
        it_is_a_valid_EthereumAddress_instance();
    });

    when ('using the from() factory', () => {
        beforeEach(() => {
            const nahmiBinary = NahmiiBinary.from(validHexData);
            binary = EthereumAddress.from(nahmiBinary);
        });
        it_is_a_valid_EthereumAddress_instance();
    });
});

given ('a EthereumAddress created from a valid Buffer', () => {
    beforeEach(() => {
        const buffer = Buffer.from(strip0x(validHexData), 'hex');
        binary = EthereumAddress.from(buffer);
    });
    it_is_a_valid_EthereumAddress_instance();
});

given ('a EthereumAddress created from a valid hex string', () => {
    beforeEach(() => {
        binary = EthereumAddress.from(validHexData);
    });
    it_is_a_valid_EthereumAddress_instance();
});

given ('a EthereumAddress created from a valid BSON binary', () => {
    beforeEach(() => {
        const buffer = Buffer.from(strip0x(validHexData), 'hex');
        binary = EthereumAddress.from(new Binary(buffer));
    });
    it_is_a_valid_EthereumAddress_instance();
});

given ('a EthereumAddress created from something with a BSON Binary like interface', () => {
    beforeEach(() => {
        const buffer = Buffer.from(strip0x(validHexData), 'hex');
        const binaryInterface = {
            length: sinon.stub(),
            read: sinon.stub()
        };
        binaryInterface.length.returns(buffer.length);
        binaryInterface.read.withArgs(0, buffer.length).returns(buffer);
        binary = EthereumAddress.from(binaryInterface);
    });
    it_is_a_valid_EthereumAddress_instance();
});

given ('an attempt to create a EthereumAddress from undefined input', () => {
    it ('throws if created by the EthereumAddress() constructor', () => {
        expect(() => new EthereumAddress()).to.throw(TypeError);
    });
    it ('returns null if created by the from() factory', () => {
        expect(EthereumAddress.from()).to.be.null;
    });
});

given ('an attempt to create a EthereumAddress from null', () => {
    it ('throws if created by the EthereumAddress() constructor', () => {
        expect(() => new EthereumAddress(null)).to.throw(TypeError);
    });
    it ('returns null if created by the from() factory', () => {
        expect(EthereumAddress.from(null)).to.be.null;
    });
});

given ('an attempt to create a EthereumAddress from an empty string', () => {
    it ('throws if created by the EthereumAddress() constructor', () => {
        expect(() => new EthereumAddress('')).to.throw(TypeError);
    });
    it ('returns null if created by the from() factory', () => {
        expect(EthereumAddress.from('')).to.be.null;
    });
});

given ('an attempt to create a EthereumAddress from an arbitrary string', () => {
    it ('throws if created by the EthereumAddress() constructor', () => {
        expect(() => new EthereumAddress('xyz')).to.throw(TypeError);
    });
    it ('returns null if created by the from() factory', () => {
        expect(EthereumAddress.from('xyz')).to.be.null;
    });
});

given ('an attempt to create a EthereumAddress from an arbitrary object', () => {
    it ('throws if created by the EthereumAddress() constructor', () => {
        expect(() => new EthereumAddress('xyz')).to.throw(TypeError);
    });
    it ('returns null if created by the from() factory', () => {
        expect(EthereumAddress.from({})).to.be.null;
    });
});

given ('a check to see if something is a EthereumAddress', () => {
    it ('does not throw if input is a EthereumAddress', () => {
        expect(() => EthereumAddress.assertInstance(EthereumAddress.from(validHexData))).to.not.throw();
    });
    it ('throws if input is undefined', () => {
        expect(() => EthereumAddress.assertInstance()).to.throw(TypeError);
    });
    it ('throws if input is null', () => {
        expect(() => EthereumAddress.assertInstance(null)).to.throw(TypeError);
    });
    it ('throws if input is an arbitrary object', () => {
        expect(() => EthereumAddress.assertInstance({})).to.throw(TypeError);
    });
});
