// Function to convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Function to import the private key
async function importPrivateKey(privateKeyBase64) {
  const privateKeyBuffer = base64ToArrayBuffer(privateKeyBase64);
  return await window.crypto.subtle.importKey(
    "pkcs8",
    privateKeyBuffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-1",
    },
    true,
    ["decrypt"]
  );
}

// Function to decrypt the message
async function decryptMessage(privateKey, encryptedMessageBase64) {
  const encryptedMessageBuffer = base64ToArrayBuffer(encryptedMessageBase64);
  console.log("Encrypted message buffer:", encryptedMessageBuffer);
  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      privateKey,
      encryptedMessageBuffer
    );
    console.log("Decrypted buffer:", decryptedBuffer);
    const decryptedMessage = new TextDecoder().decode(decryptedBuffer);
    return decryptedMessage;
  } catch (error) {
    console.error("Error during decryption:", error);
    throw error; // Rethrow the error to be caught by the calling code
  }
}

// Example usage
console.log("Starting function...");
const privateKeyBase64 =
  "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD5fOA0pDa8I5fTMG4/xETxZh5NDxQ0Xb5pFWkISplaoE0+rO7ZT1PRsYNUbLVNJSNJJTGjPviR975TYik2BbCkl3ive1Ef+9net1k6FjDixmUcyivrwuynXp52wG/wsKTVGEwsC0ovCiMuJyKleBTcHbWq0lIt7WhcQBRYhYDb45dYSS0ZHPfB8An0jF8iN156LsCCFsQ0z7Fb8/8YKFpSwWGJOqdfZNCszlQ/S8IHMIyk5mYYD29lJEXixjVOQlPKnflNubXFM4WsOL+XpXQkbjW/l/wzC+JI81nxpzvM0XFDrVRKT0iMV7Z6zj787mVoZOQa2PCS07zGxQYAMpL3AgMBAAECggEAfKYTAMoQ3MPtvaLDWpGtnmxWdEq13gn+MdN0JCPdZcWUgl11glZbeve1NW+Qz6ff7tIp8DVsjMVaLp/rFiYWoM1bC1XR7OhwbJFvf5GJwCu+Zfluoz7C7UZdZthztS4UVLFskU7ctA7dD9iWu1R5G5auZtfpHjAwxXJwl9+vx2v8b1/hu370JeACCvvtCV6AFe3UvqSUo+U/NDRlPYwYHVsNpUR6CrjYJ/UjQ1NWzZURZykQXbYfnvUSmAEt9OS+AAK4F8YZmYBGo9XGv1xtIUNg49V2qcQD+o5MrmUJW4qUmCce64806v0RUGQSLnC1LFcjqPVU0Toab5uQAXOA2QKBgQD9LG6knoM6bsCOTTaNrwrgo1lkZVapAufbbU0Et4YbfW25gdce8A0+J9uaa+j7qPFXGqLrXyH9KC3ytoQmTQ4e1vikC5M1pE3V0BmqZrXKLoTB+EBzz2rfF9SghF0YjZk2upaFUBOGHAQ2yI7VnQTxoTLulHCAvgRJwC1YCNYfGQKBgQD8RejjAyyCITKaaj0vsZ9e6w5lrqJg8E2BMYeUej56adS+vBfgVcTnsKWAmoGvBu/BXJHMqQ9uFAEZIf6MKQNt1AbXtyKBnfrgojwrl/MIn6bsvRHcDy99+XqEhcZjhl34fPsPhTocKxxHhZQXcDTK+MnTl7fEduShwR1iVNtUjwKBgAZziWY8e8+TXujBYvB9U2OiBfce9fRclJfs0xeZrZspuRAPFPI+37eDwH7Q3SD8jxnPHfOteuo+id0zdW6cbA2xIKjdeqTVSP53zQ+gimVahhuDPfE1id2hd9OXS+ACS7MvUgKXpce3EwxqU+lxlNyrZObbdXpyXR2b/gvOPdaRAoGBALqPsMSBSl8J0fRj8M/ema+GQWVtGmR6EbcjO9LP/Hhm35AWZcnfY/i7qAlNOe6IQLJMlP43YFPVs2I0w5w/kGueS1kn8/rLLAcHs1vByVdtSfL1d8m36TVOVA7BJ4/ehIwJUVmO+wRt1UIHRRd4QXKBPjCemKZQDpCY0fQwMOt9AoGBAIdWaj8nm31PX7GI0d6HP98KW4bjUCC+zPteeJMyCt+wAEXNBN2T31kHSTqcUCiWwuKl6DrxJw/d9u5a3Hn2UgNWUNkwNn9FzlMpKJxnNHqpAYNzGJKsv6NfwzEgHrQG9hSQjzzVmpWL6bNw/l0AgwZBGb5Yk08gg4X9KW7Iwi9r";
const encryptedMessageBase64 =
  "NKCBji5EVbTCFn4WbeeSPz+43Q477SQi7hNpy1HKuoXSQqPKVfATO7NJFMkPafdPJ/uFqvErLJM2ytlEmD4PO5wpsJM3ZAnX1JQxpXe8YWCTMgzMDKUysiVoDvQCeQswwEXN6RfH7LivOR/HHQYBUNWw6W7dCk4lx+jemv/8nUxzAAzzq0eHeKyvt/n4/RQi8i0V6pQ46U0eTsg0V1pb0fpRqxgkz0IwD/K6/iXG+dspEklIgr5bHhq/Irb94Bdn5XmEJ3Q+HdzRjZ291CyvZR5ASBLfirUhbnkBr6buprtFx08ANYTZm5RUrWG5dTrqsKJOWSovlvX/gEyeSCkQfg==";

try {
  const privateKey = await importPrivateKey(privateKeyBase64);
  console.log("Private key imported successfully.");
  const decryptedMessage = await decryptMessage(
    privateKey,
    encryptedMessageBase64
  );
  console.log("Decrypted message:", decryptedMessage);
} catch (error) {
  console.error("Error decrypting message:", error);
}
