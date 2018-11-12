'use strict';

const chai = require('chai');
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
    let address, hexAddress;

    function verifyEthereumAddressInstance() {
        it('can be converted to a hex string', () => {
            expect(address.toString()).to.eql(hexAddress);
        });

        it('can be converted to a buffer', () => {
            expect(address.toBuffer()).to.eql(Buffer.from(strip0x(hexAddress), 'hex'));
        });

        it('can be converted to a BSON Binary', () => {
            expect(address.toBinary()).to.eql(new Binary(Buffer.from(strip0x(hexAddress), 'hex')));
        });
    }

    context('a new EthereumAddress from a valid Buffer', () => {
        beforeEach(() => {
            hexAddress = '0x0011223344556677889900112233445566778899';
            const buffer = Buffer.from(strip0x(hexAddress), 'hex');
            address = new EthereumAddress(buffer);
        });

        verifyEthereumAddressInstance();
    });

    context('a new EthereumAddress from a hexadecimal string', () => {
        beforeEach(() => {
            hexAddress = '0x0011223344556677889900112233445566778899';
            address = EthereumAddress.from(hexAddress);
        });

        verifyEthereumAddressInstance();
    });

    context('a new EthereumAddress from a valid BSON binary', () => {
        beforeEach(() => {
            hexAddress = '0x0011223344556677889900112233445566778899';
            const buffer = Buffer.from(strip0x(hexAddress), 'hex');
            const binary = new Binary(buffer);
            address = EthereumAddress.from(binary);
        });

        verifyEthereumAddressInstance();
    });

    context('a new EthereumAddress from an existing EthereumAddress', () => {
        beforeEach(() => {
            hexAddress = '0x0011223344556677889900112233445566778899';
            const otherAddress = new EthereumAddress(Buffer.from(strip0x(hexAddress), 'hex'));
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
});
