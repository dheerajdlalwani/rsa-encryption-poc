async function generateClientPublicAndPrivateKeys() {
  console.log("Initializing RSA Key Pair Generator instance.");
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-1",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const publicKey = await window.crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
  );
  const privateKey = await window.crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey
  );

  const publicKeyBase64 = btoa(
    String.fromCharCode.apply(null, new Uint8Array(publicKey))
  );
  const privateKeyBase64 = btoa(
    String.fromCharCode.apply(null, new Uint8Array(privateKey))
  );

  console.log("Public Key:");
  console.log(publicKeyBase64);
  console.log("Private Key:");
  console.log(privateKeyBase64);
}

generateClientPublicAndPrivateKeys()
  .then(() => {
    console.log("Done.");
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });
