# ETHEREUM-ADDRESS

This is a small utility library for parsing, validating and converting an
ethereum address.

## Installation

    npm install @hubiinetwork/ethereum-address

## Usage

Creating a new address from a string:

```javascript

    const EthereumAddress = require('@hubiinetwork/ethereum-address';

    let addr = EthereumAddress.from('0x0011223344556677889900112233445566778899');

    if (!addr)
        console.log('Address is not valid');

```

## EthereumAddress - constructor()

The constructor can be invoked with either a 20 byte Buffer or an already
existing EthereumAddress instance.

Invalid input will throw a `TypeError`.

## EthereumAddress - from()

The static `from` class method is able to construct an EthereumAddress from
strings or BSON Binary objects.

It will either return a new instance of an EthereumAddress or `null` if
conversion was not possible.

## EthereumAddress - toString()

This method will return a hexadecimal string representation of the address.

## EthereumAddress - toBuffer()

This method will return a Buffer containing the address.

## EthereumAddress - toBinary()

This method will return a BSON Binary containing the address.
