// Function to load the public key from a base64 string
async function loadServerPublicKey(serverPublicKeyBase64) {
  const publicKeyData = window.atob(serverPublicKeyBase64);
  const publicKeyBuffer = new Uint8Array(publicKeyData.length);
  for (let i = 0; i < publicKeyData.length; ++i) {
    publicKeyBuffer[i] = publicKeyData.charCodeAt(i);
  }
  return await window.crypto.subtle.importKey(
    "spki",
    publicKeyBuffer,
    {
      name: "RSA-OAEP",
      hash: {
        name: "SHA-1",
      },
    },
    true,
    ["encrypt"]
  );
}

// Function to encrypt data using RSA with the given public key
async function encryptRSA(publicKey, plaintext) {
  const clientEncryptedData = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    new TextEncoder().encode(plaintext)
  );
  return window.btoa(
    String.fromCharCode.apply(null, new Uint8Array(clientEncryptedData))
  );
}

// Get the public key sent from sever
// currently, I am hard coding here
const serverPublicKeyBase64 =
  "MIIEIjANBgkqhkiG9w0BAQEFAAOCBA8AMIIECgKCBAEAqwMw4rZDSJbVm2mf2ChX/ZDZnW2IVp/q+cHnV8sroEOp0aeqmvk+YnAIQdcY8mRvJezo4nu6EROIcQi5gVWLUGBNg2Vs0QNlvg8OG7XapaXrJaEgZT6aQ75cgA0aeb7UL/k12ZgvAGwTw/5wUTqhke4yFTBD24HNACmej0XXdC8dQ57+CCcU98JsYqLD9pODJAmfVrXGbUMfTfhnAtDfPQyMaKdxXggj++LTCZA7mh5zVtJCY04qN/6uJiLue6tVaZiDEF63UEPfsEZ+VfpKorSqcDpmpg60rDdW5rfRHNc5JrXouPQJcavterxjy55IrN/IWxYqe5Uh5fxfp6qJl+Z9Sx69hwiV+TkIgoY48sRUZrFm/VVc9fa5g5wWCzSY/9KT6XmSyNa2SdvF5TxKOjLOfUFUQMdwYkMoP9tKp0LILEKvrv5zZ9ee8kbbufMWAr4uM2ffE1F9iFvoB2nvjcx7fLTMk1UX8EgWymxXd4B6s5efJarW29ihIKV/DKP44jdoFrjjDyew63e42HQ5LKPRbDuIqmzhp6odp8Z9xiPLk2s7TAuY7jv+j/441BAISXKlAmSGNeTRAxL356Tpn6gMDCdiPisLn8qT69POdHOi7RcriZ5fZgRPKrb48K3c2Y9eRJ61wdtT98IL2xFzLYi5VfYcbUeAehVQBz22UNSvN2Fn/FrwTSEI+FWGvBDFco4TXyA8SsJpPWNKuGYENcr9in/ldOy9Xks9Flejoq91JiQIfzOH6IzklNBxNy2gksmN352K/dPVx9lWXajfgxU9t2ysLl8l+G/VLXqQ1hB2Z5ThIgaWgdiG2tV8TRlXfqGNo6L+PZckUTLkdvWQzBBTym7TeNXeSy8Hw+HLginyn7lCGp/gEX0Gqd0+0hftLJF1bWr++0r5BheoO6VXababnRttTWK16qc1nbhHp2R5QJtWY/H9t7Cyc4KeKQ7K96PT8o3biNncxLZdxELKrHxhUAYX8s35243SKXeC2ZeICtXaubxu6i4imiDTHLQ8HN6lISs0NkQSIh0hZ0E9j9ct6PbIFGSQAZg6SAXItpipq4vH+lnhLOffoGPbCbKSXQup3XWY15NXim39Q9r3eH3FmFtOFRfEqoX5Rhep2C3SRSKCex4fICsThWCVmSmAI9aBwTi/2IYKnXc5FMWT9flpBK++GY695NOrr7HrNZON31M3UrND/Ug9ctz8c6qZZ65Pvkr7c8M9TO9JEuKJGpJo4GR2Avu6scgncy+m7GlH2WimP89/xgswBS16yY07EK5hgVYRljArZPaYkoNazMhSqashDb6tjJL8JS1UfSH/xsqWy4a+8LUZ3040HGYfWf1xLfEiWwBSoWkn14GjwwIDAQAB";

(async () => {
  try {
    const publicKey = await loadServerPublicKey(serverPublicKeyBase64);
    const plaintext =
      '{"username": "reshma-client", "password":"1234test-client"}';
    const clientEncryptedData = await encryptRSA(publicKey, plaintext);
    console.log("Encrypted data:", clientEncryptedData);
  } catch (error) {
    console.error("Encryption failed:", error);
  }
})();
