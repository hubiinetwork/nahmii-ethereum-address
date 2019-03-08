'use strict';

const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const {Binary} = require('bson');
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

function it_is_a_valid_NahmiiBinary_instance () {
    it ('asserts as a NahmiiBinary instance', () => {
        expect(() => NahmiiBinary.assertInstance(binary)).to.not.throw();
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
    it ('equals a NahmiiBinary of same value', () => {
        expect(binary.isEqual(NahmiiBinary.from(validHexData))).to.be.true;
    });
    it ('does not equal a NahmiiBinary of different value', () => {
        expect(binary.isEqual(NahmiiBinary.from(validHexData.replace('0', '1')))).to.be.false;
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
}

given ('a NahmiiBinary created from a NahmiiBinary', () => {
    when ('using the constructor', () => {
        beforeEach(() => {
            const otherBinary = NahmiiBinary.from(validHexData);
            binary = new NahmiiBinary(otherBinary);
        });
        it_is_a_valid_NahmiiBinary_instance();
    });

    when ('using the from() factory', () => {
        beforeEach(() => {
            const otherBinary = NahmiiBinary.from(validHexData);
            binary = NahmiiBinary.from(otherBinary);
        });
        it_is_a_valid_NahmiiBinary_instance();
    });
});

given ('a NahmiiBinary created from a valid Buffer', () => {
    when ('using the constructor', () => {
        beforeEach(() => {
            const buffer = Buffer.from(strip0x(validHexData), 'hex');
            return new NahmiiBinary(buffer);
        });
        it_is_a_valid_NahmiiBinary_instance();
    });
    when ('using the from() factory', () => {
        beforeEach(() => {
            const buffer = Buffer.from(strip0x(validHexData), 'hex');
            binary = NahmiiBinary.from(buffer);
        });
        it_is_a_valid_NahmiiBinary_instance();
    });
});

given ('a NahmiiBinary created from a valid hex string', () => {
    beforeEach(() => {
        binary = NahmiiBinary.from(validHexData);
    });
    it_is_a_valid_NahmiiBinary_instance();
});

given ('a NahmiiBinary created from a valid BSON binary', () => {
    beforeEach(() => {
        const buffer = Buffer.from(strip0x(validHexData), 'hex');
        binary = NahmiiBinary.from(new Binary(buffer));
    });
    it_is_a_valid_NahmiiBinary_instance();
});

given ('a NahmiiBinary created from something with a BSON Binary like interface', () => {
    beforeEach(() => {
        const buffer = Buffer.from(strip0x(validHexData), 'hex');
        const binaryInterface = {
            length: sinon.stub(),
            read: sinon.stub()
        };
        binaryInterface.length.returns(buffer.length);
        binaryInterface.read.withArgs(0, buffer.length).returns(buffer);
        binary = NahmiiBinary.from(binaryInterface);
    });
    it_is_a_valid_NahmiiBinary_instance();
});

given ('an attempt to create a NahmiiBinary from undefined input', () => {
    it ('throws if created by the EthereumAddress() constructor', () => {
        expect(() => new NahmiiBinary()).to.throw(TypeError);
    });
    it ('returns null if created by the from() factory', () => {
        expect(NahmiiBinary.from()).to.be.null;
    });
});

given ('an attempt to create a NahmiiBinary from null', () => {
    it ('throws if created by the EthereumAddress() constructor', () => {
        expect(() => new NahmiiBinary(null)).to.throw(TypeError);
    });
    it ('returns null if created by the from() factory', () => {
        expect(NahmiiBinary.from(null)).to.be.null;
    });
});

given ('an attempt to create a NahmiiBinary from an empty string', () => {
    it ('throws if created by the EthereumAddress() constructor', () => {
        expect(() => new NahmiiBinary('')).to.throw(TypeError);
    });
    it ('returns null if created by the from() factory', () => {
        expect(NahmiiBinary.from('')).to.be.null;
    });
});

given ('an attempt to create a NahmiiBinary from an arbitrary string', () => {
    it ('throws if created by the EthereumAddress() constructor', () => {
        expect(() => new NahmiiBinary('xyz')).to.throw(TypeError);
    });
    it ('returns null if created by the from() factory', () => {
        expect(NahmiiBinary.from('xyz')).to.be.null;
    });
});

given ('an attempt to create a NahmiiBinary from an arbitrary object', () => {
    it ('throws if created by the EthereumAddress() constructor', () => {
        expect(() => new NahmiiBinary('xyz')).to.throw(TypeError);
    });
    it ('returns null if created by the from() factory', () => {
        expect(NahmiiBinary.from({})).to.be.null;
    });
});

given ('a check to see if something is a NahmiiBinary', () => {
    it ('does not throw if input is a NahmiiBinary', () => {
        expect(() => NahmiiBinary.assertInstance(NahmiiBinary.from(validHexData))).to.not.throw();
    });
    it ('throws if input is undefined', () => {
        expect(() => NahmiiBinary.assertInstance()).to.throw(TypeError);
    });
    it ('throws if input is null', () => {
        expect(() => NahmiiBinary.assertInstance(null)).to.throw(TypeError);
    });
    it ('throws if input is an arbitrary object', () => {
        expect(() => NahmiiBinary.assertInstance({})).to.throw(TypeError);
    });
});
