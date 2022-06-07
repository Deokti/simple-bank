# Simple Bank

Basic project structure.

Created using Hardhat in TypeScript.

## Available commands from `scripts`

- `npm run help`
- `npm run node`. Creates 20 test accounts with 10,000 EHT
- `npm run test`. Runs tests. To run one test `npm run test test/test_name.ts`
- `npm run build`. Compiles contracts
- `npm run size`. Collects contracts and checks its size
- `npm run check-check-updates`. Compares latest versions of packages
- `npm run coverage`. coverage Shows test coverage and possible problems

## Packages worth paying attention to:

- `hardhat` and adjacent to it. Project Core.
- `chai-arrays` and `chai-as-promised`. Adds new methods for testing arrays and asynchronous tests
- `hardhat-contract-sizer`. Wrapper over hardhat.config.ts. Shows the size of the contract(s)
- `hardhat-gas-reporter`. Wrapper over hardhat.config.ts. Shows gas consumption.
- `@typechain/hardhat`. Generates d.ts contract files. Allows you to use them when writing frontend in TypeScript.
- `solidity-coverage`. [Shows](https://blog.colony.io/code-coverage-for-solidity-eecfa88668c2/) the percentage of test coverage. Finds weaknesses.
