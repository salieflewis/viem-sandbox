import { createPublicClient, http, type Block } from 'viem';
import { mainnet } from 'viem/chains';
import env from './services/env';
import { replacer } from './utils';
import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http';

const transport = http(
  `https://eth-mainnet.g.alchemy.com/v2/${env.ALCHEMY_KEY}`
);

const client = createPublicClient({
  chain: mainnet,
  transport,
});

let latestBlock: Block

client.watchBlocks({
  onBlock: (block) => {
    console.log(block);
    latestBlock = block;
  },
});

createServer((req: IncomingMessage, res: ServerResponse) => {
  if (latestBlock) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(latestBlock, replacer));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end("No block data available");
  }
}).listen(3000);

console.log('Listening on port 3000');