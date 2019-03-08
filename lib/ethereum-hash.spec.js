'use strict';

const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const {Binary} = require('bson');
const EthereumHash = require('./ethereum-hash');
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

const validHexData = '0x683009eedc8a75813844475de22b78dbfca30dee855c0cc6f8b80cb1dc359e97';
let binary;

function it_is_a_valid_EthereumHash_instance () {
    it ('asserts as a EthereumHash instance', () => {
        expect(() => EthereumHash.assertInstance(binary)).to.not.throw();
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
    it ('equals a EthereumHash of same value', () => {
        expect(binary.isEqual(EthereumHash.from(validHexData))).to.be.true;
    });
    it ('does not equal a EthereumHash of different value', () => {
        expect(binary.isEqual(EthereumHash.from(validHexData.replace('0', '1')))).to.be.false;
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
        expect(binary.length).to.equal(32); // Bytes
    });
}

given ('a EthereumHash created from a EthereumHash', () => {
    when ('using the constructor', () => {
        beforeEach(() => {
            const otherBinary = EthereumHash.from(validHexData);
            binary = new EthereumHash(otherBinary);
        });
        it_is_a_valid_EthereumHash_instance();
    });

    when ('using the from() factory', () => {
        beforeEach(() => {
            const otherBinary = EthereumHash.from(validHexData);
            binary = EthereumHash.from(otherBinary);
        });
        it_is_a_valid_EthereumHash_instance();
    });
});

given ('a EthereumHash created from a NahmiiBinary', () => {
    when ('using the constructor', () => {
        beforeEach(() => {
            const nahmiiBinary = NahmiiBinary.from(validHexData);
            binary = new EthereumHash(nahmiiBinary);
        });
        it_is_a_valid_EthereumHash_instance();
    });

    when ('using the from() factory', () => {
        beforeEach(() => {
            const nahmiiBinary = NahmiiBinary.from(validHexData);
            binary = EthereumHash.from(nahmiiBinary);
        });
        it_is_a_valid_EthereumHash_instance();
    });
});

given ('a EthereumHash created from a valid Buffer', () => {
    beforeEach(() => {
        const buffer = Buffer.from(strip0x(validHexData), 'hex');
        binary = EthereumHash.from(buffer);
    });
    it_is_a_valid_EthereumHash_instance();
});

given ('a EthereumHash created from a valid hex string', () => {
    beforeEach(() => {
        binary = EthereumHash.from(validHexData);
    });
    it_is_a_valid_EthereumHash_instance();
});

given ('a EthereumHash created from a valid BSON binary', () => {
    beforeEach(() => {
        const buffer = Buffer.from(strip0x(validHexData), 'hex');
        binary = EthereumHash.from(new Binary(buffer));
    });
    it_is_a_valid_EthereumHash_instance();
});

given ('a EthereumHash created from something with a BSON Binary like interface', () => {
    beforeEach(() => {
        const buffer = Buffer.from(strip0x(validHexData), 'hex');
        const binaryInterface = {
            length: sinon.stub(),
            read: sinon.stub()
        };
        binaryInterface.length.returns(buffer.length);
        binaryInterface.read.withArgs(0, buffer.length).returns(buffer);
        binary = EthereumHash.from(binaryInterface);
    });
    it_is_a_valid_EthereumHash_instance();
});

given ('an attempt to create a EthereumHash from undefined input', () => {
    it ('throws if created by the EthereumHash() constructor', () => {
        expect(() => new EthereumHash()).to.throw(TypeError);
    });
    it ('returns null if created by the from() factory', () => {
        expect(EthereumHash.from()).to.be.null;
    });
});

given ('an attempt to create a EthereumHash from null', () => {
    it ('throws if created by the EthereumHash() constructor', () => {
        expect(() => new EthereumHash(null)).to.throw(TypeError);
    });
    it ('returns null if created by the from() factory', () => {
        expect(EthereumHash.from(null)).to.be.null;
    });
});

given ('an attempt to create a EthereumHash from an empty string', () => {
    it ('throws if created by the EthereumHash() constructor', () => {
        expect(() => new EthereumHash('')).to.throw(TypeError);
    });
    it ('returns null if created by the from() factory', () => {
        expect(EthereumHash.from('')).to.be.null;
    });
});

given ('an attempt to create a EthereumHash from an arbitrary string', () => {
    it ('throws if created by the EthereumHash() constructor', () => {
        expect(() => new EthereumHash('xyz')).to.throw(TypeError);
    });
    it ('returns null if created by the from() factory', () => {
        expect(EthereumHash.from('xyz')).to.be.null;
    });
});

given ('an attempt to create a EthereumHash from an arbitrary object', () => {
    it ('throws if created by the EthereumHash() constructor', () => {
        expect(() => new EthereumHash('xyz')).to.throw(TypeError);
    });
    it ('returns null if created by the from() factory', () => {
        expect(EthereumHash.from({})).to.be.null;
    });
});

given ('a check to see if something is a EthereumHash', () => {
    it ('does not throw if input is a EthereumHash', () => {
        expect(() => EthereumHash.assertInstance(EthereumHash.from(validHexData))).to.not.throw();
    });
    it ('throws if input is undefined', () => {
        expect(() => EthereumHash.assertInstance()).to.throw(TypeError);
    });
    it ('throws if input is null', () => {
        expect(() => EthereumHash.assertInstance(null)).to.throw(TypeError);
    });
    it ('throws if input is an arbitrary object', () => {
        expect(() => EthereumHash.assertInstance({})).to.throw(TypeError);
    });
});
