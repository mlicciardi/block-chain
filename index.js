'use strict'

const SHA256 = require('crypto-js/sha256');

class BlockChain{
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, '01/01/2017', 'Genesis block', '0');
  }

  addBlock(block) {
    block.previousHash = this.chain[this.chain.length - 1].hash;
    block.hash = block.calculateHash();
    this.chain.push(block);
  }
}

class Block {
  constructor(index, timestamp, data, previousHash = '') {
      this.index = index;
      this.previousHash = previousHash;
      this.timestamp = timestamp;
      this.data = data;
      this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }
}
