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
const serverPublicKeyBase64 = "<SERVER_PUBLIC_KEY_BASE_64>";

(async () => {
  try {
    const publicKey = await loadServerPublicKey(serverPublicKeyBase64);
    const plaintext =
      '{"username": "darshan_maniyar1", "password":"Aa123456781@a2"}';
    const clientEncryptedData = await encryptRSA(publicKey, plaintext);
    console.log("Encrypted data:", clientEncryptedData);
  } catch (error) {
    console.error("Encryption failed:", error);
  }
})();
