'use strict'

const SHA256 = require('crypto-js/sha256');

let bc = new Blockchain();
bc.addBlock(new Block(1, '20/07/2017', { amount: 1 }));
bc.addBlock(new Block(2, '20/07/2017', { amount: 1 }));

console.log(`BC ${bc.isChainValid() ? 'is valid' : 'integrity is corrupted'}`);

console.log('Changing a block...');
bc.chain[1].data = { amount: 100 };
bc.chain[1].hash = bc.chain[1].calculateHash();

console.log(`BC ${bc.isChainValid() ? 'is valid' : 'integrity is corrupted'}`);

console.log(JSON.stringify((bc, null, 4)));

class BlockChain{
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, '01/01/2017', 'Genesis block', '0');
  }

  addBlock(block) {
    block.previousHash = this.getLatestBlock().hash;
    block.hash = block.calculateHash();
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
