'use strict'

const SHA256 = require('crypto-js/sha256');
const moment = require('moment');

class BlockChain{
  constructor() {
    this.difficulty = 2;
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, moment().unix(), null, null);
  }

  addBlock(block) {
    block.previousHash = this.getLatestBlock().hash;
    block.mineBlock(this.difficulty);
    this.chain.push(block);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) return false;

      if (currentBlock.previousHash !== previousBlock.hash) return false;
    }

    return true;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
}

class Block {
  constructor(index, timestamp, data, previousHash = null) {
      this.index = index;
      this.timestamp = timestamp;
      this.data = data;
      this.previousHash = previousHash;
      this.nonce = 0;
      this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    console.log(`${moment().format()} | START MINING...`);
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`${moment().format()} | BLOCK MINED! ${this.hash}`);
  }
}

let bc = new BlockChain();
bc.addBlock(new Block(1, moment().unix(), { amount: 1 }));
bc.addBlock(new Block(2, moment().unix(), { amount: 1 }));

// console.log(JSON.stringify(bc, null, 4));

// console.log(`BC ${bc.isChainValid() ? 'is valid' : 'integrity is corrupted'}`);

// console.log('Changing a block...');
// bc.chain[1].data = { amount: 100 };
// bc.chain[1].hash = bc.chain[1].calculateHash();

// console.log(`BC ${bc.isChainValid() ? 'is valid' : 'integrity is corrupted'}`);
