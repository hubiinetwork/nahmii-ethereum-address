'use strict';

const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const {Binary} = require('bson');
const EthereumAddress = require('./ethereum-address');

function strip0x(str) {
    if (!str)
        return str;
    if (typeof(str) !== 'string')
        return str;

    return str.replace(/^(0x)+/i, '');
}

describe('EthereumAddress', () => {
    let address, hexData;

    function verifyEthereumAddressInstance() {
        it('can be converted to a hex string', () => {
            expect(address.toString()).to.eql(hexData);
        });

        it('can be converted to a buffer', () => {
            expect(address.toBuffer()).to.eql(Buffer.from(strip0x(hexData), 'hex'));
        });

        it('can be converted to a BSON Binary', () => {
            expect(address.toBinary()).to.eql(new Binary(Buffer.from(strip0x(hexData), 'hex')));
        });
    }

    context('a new EthereumAddress from a valid Buffer', () => {
        beforeEach(() => {
            hexData = '0x0011223344556677889900112233445566778899';
            const buffer = Buffer.from(strip0x(hexData), 'hex');
            address = new EthereumAddress(buffer);
        });

        verifyEthereumAddressInstance();
    });

    context('a new EthereumAddress from a hexadecimal string', () => {
        beforeEach(() => {
            hexData = '0x0011223344556677889900112233445566778899';
            address = EthereumAddress.from(hexData);
        });

        verifyEthereumAddressInstance();
    });

    context('a new EthereumAddress from a valid BSON binary', () => {
        beforeEach(() => {
            hexData = '0x0011223344556677889900112233445566778899';
            const buffer = Buffer.from(strip0x(hexData), 'hex');
            const binary = new Binary(buffer);
            address = EthereumAddress.from(binary);
        });

        verifyEthereumAddressInstance();
    });

    context('a new EthereumAddress from something that looks like a valid BSON binary', () => {
        beforeEach(() => {
            hexData = '0x0011223344556677889900112233445566778899';
            const buffer = Buffer.from(strip0x(hexData), 'hex');
            const binaryInterface = {
                length: sinon.stub(),
                read: sinon.stub()
            };
            binaryInterface.length.returns(20);
            binaryInterface.read.withArgs(0, 20).returns(buffer);
            address = EthereumAddress.from(binaryInterface);
        });

        verifyEthereumAddressInstance();
    });

    context('a new EthereumAddress from an existing EthereumAddress', () => {
        beforeEach(() => {
            hexData = '0x0011223344556677889900112233445566778899';
            const otherAddress = new EthereumAddress(Buffer.from(strip0x(hexData), 'hex'));
            address = new EthereumAddress(otherAddress);
        });

        verifyEthereumAddressInstance();
    });

    context('a new EthereumAddress from unsupported data', () => {
        it('throws exception in constructor', () => {
            expect(() => new EthereumAddress({})).to.throw(TypeError);
        });

        it('returns null from factory function', () => {
            expect(EthereumAddress.from({})).to.be.null;
        });
    });

    context('a new EthereumAddress from invalid string input', () => {
        it('returns null from factory function', () => {
            expect(EthereumAddress.from('some string input that is not an address')).to.be.null;
        });
    });

    context('a new EthereumAddress from a wrongly sized BSON binary', () => {
        let binary;

        beforeEach(() => {
            hexData = '0x00112233445566778899';
            const buffer = Buffer.from(strip0x(hexData), 'hex');
            binary = new Binary(buffer);
        });

        it('returns null from factory function', () => {
            expect(EthereumAddress.from(binary)).to.be.null;
        });
    });

    context('a new EthereumAddress from a wrongly sized buffer', () => {
        let shortBuffer;

        beforeEach(() => {
            hexData = '0x00112233445566778899';
            shortBuffer = Buffer.from(strip0x(hexData), 'hex');
        });

        it('throws exception in constructor', () => {
            expect(() => new EthereumAddress(shortBuffer)).to.throw(TypeError);
        });
    });
});
