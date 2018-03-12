'use strict'

const SHA256 = require('crypto-js/sha256');
const moment = require('moment');

class BlockChain{
  constructor() {
    this.reward = 1;
    this.difficulty = 1;
    this.transactions = [];
    this.chain = [new Block(moment().unix(), this.transactions, null)];
  }

  mineTransactions(address) {
    let timestamp = moment().unix();
    let transactions = this.transactions;
    let lastBlock = this.getLatestBlock().hash;

    let block = new Block(timestamp, transactions, lastBlock)
    block.mineBlock(this.difficulty);

    this.chain.push(block);

    this.transactions = [new Transaction(null, address, this.reward)];
  }

  createTransaction(transaction) {
    this.transactions.push(transaction);
  }

  getBalance(address) {
    let balance = 0;

    this.chain.map((block) => {
      block.transactions.map((transaction) => {
        if (transaction.from === address) balance -= transaction.amount;
        if (transaction.to === address) balance += transaction.amount;
      });
    });

    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.previousHash !== previousBlock.hash) return false;

      if (currentBlock.hash !== currentBlock.calculateHash()) return false;
    }

    return true;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = null) {
    this.timestamp = timestamp;
    this.previousHash = previousHash;
    this.transactions = transactions;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.previousHash
      + this.timestamp
      + JSON.stringify(this.transactions)
      + this.nonce)
      .toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
        this.nonce++;
        this.hash = this.calculateHash();
    }
  }
}

class Transaction{
  constructor(from, to, amount) {
      this.from = from;
      this.to = to;
      this.amount = amount;
  }
}

const log = function log() {
  console.log(`\nBC integrity: ${bc.isChainValid() ? 'valid' : 'CORRUPTED!'}`);
  miners.map((m) => console.log(`Balance of ${m} is ${bc.getBalance(m)}`));
  console.log(`${bc.chain.length} nodes in the chain.\n`);
}

let miner = 'alice';
let miners = [miner, 'bob'];

let bc = new BlockChain();

log();

console.log('Starting the miner...');
bc.mineTransactions(miner);

console.log('Starting the miner again...');
bc.mineTransactions(miner);

console.log('Starting the miner again again...');
bc.mineTransactions(miner);

log();

console.log('Transaction: Alice => Bob');
bc.createTransaction(new Transaction(miner, 'bob', 1));

console.log('Transaction: Alice <= Bob');
bc.createTransaction(new Transaction('bob', miner, 1));

log();
