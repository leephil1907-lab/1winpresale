/**
 * Compiles contracts/OneWinPresale.sol with solc-js and writes artifacts:
 *   contracts/artifacts/OneWinPresale.abi.json
 *   contracts/artifacts/OneWinPresale.bytecode.txt
 *
 * IMPORTANT (TRON): we pin evmVersion to "paris" so the bytecode contains no
 * Shanghai PUSH0 opcodes, which TVM builds without Shanghai support reject.
 *
 * Run:  node scripts/compile-contract.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import solc from "solc";

const source = readFileSync("contracts/OneWinPresale.sol", "utf8");

const input = {
  language: "Solidity",
  sources: {
    "OneWinPresale.sol": { content: source },
  },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    evmVersion: "paris",
    outputSelection: {
      "*": { "*": ["abi", "evm.bytecode"] },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

for (const entry of output.errors ?? []) {
  console.log(`[${entry.severity}] ${entry.formattedMessage}`);
}
const hasErrors = (output.errors ?? []).some((e) => e.severity === "error");
if (hasErrors) process.exit(1);

const contract = output.contracts["OneWinPresale.sol"].OneWinPresale;
mkdirSync("contracts/artifacts", { recursive: true });
writeFileSync(
  "contracts/artifacts/OneWinPresale.abi.json",
  JSON.stringify(contract.abi, null, 2)
);
writeFileSync(
  "contracts/artifacts/OneWinPresale.bytecode.txt",
  contract.evm.bytecode.object
);

console.log("COMPILE_OK");
console.log(`ABI entries: ${contract.abi.length}`);
console.log(`Bytecode size: ${contract.evm.bytecode.object.length / 2} bytes`);
