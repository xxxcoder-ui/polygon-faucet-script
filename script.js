import axios from "axios";

async function tryOnce() {
  const response = await axios.post(
    "https://api.faucet.matic.network/transferTokens",
    {
      network: "mainnet",
      address: process.argv[3],
      token: "maticToken",
    }
  );

  if (response.data.error?.includes("replacement transaction underpriced")) {
    return tryOnce();
  } else if (response.data.error?.includes("greylisted")) {
    return "greylisted";
  } else {
    return "success";
  }
}

async function tryMultiple(numTimes) {
  console.log(`tryMultiple: numTimes = ${numTimes}`);
  if (numTimes <= 0) {
    return;
  }

  const tryOnceResult = await tryOnce();
  console.log(`tryMultiple: tryOnceResult = ${tryOnceResult}`);
  if (tryOnceResult === "success") {
    // Try after 62 seconds
    setTimeout(() => tryMultiple(numTimes - 1), 0);
  } else if (tryOnceResult === "greylisted") {
    // Try after 62 seconds, don't decrement numTimes
    setTimeout(() => tryMultiple(numTimes), 0);
  } else {
    // Try again immediately
    tryMultiple(numTimes);
  }
}

tryMultiple(Number(process.argv[2]));
