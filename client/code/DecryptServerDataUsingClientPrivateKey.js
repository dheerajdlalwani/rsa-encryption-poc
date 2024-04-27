// Function to convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64)
{
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++)
    {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// Function to import the private key
async function importPrivateKey(privateKeyBase64)
{
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

async function importAESKey(AESKeyBuffer)
{
    // Import the decrypted symmetric key into a CryptoKey object
    console.log("trying to import the symmetric key");
    return await window.crypto.subtle.importKey(
        "raw",
        AESKeyBuffer,
        {
            name: "AES-CBC",
        },
        false,
        ["decrypt"]
    );
}

async function decryptSymmetricKey(privateKey, encryptedKeyBase64)
{
    const encryptedKeyBuffer = base64ToArrayBuffer(encryptedKeyBase64);
    console.log("Encrypted key buffer:", encryptedKeyBuffer);
    try
    {
        const decryptedKeyBuffer = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP",
            },
            privateKey,
            encryptedKeyBuffer
        );
        console.log("Decrypted key buffer:", decryptedKeyBuffer);
        const decryptedKey = new TextDecoder().decode(decryptedKeyBuffer);
        console.log("Decryted key = " + decryptedKey);

        return decryptedKeyBuffer;
    }
    catch (error)
    {
        console.error("Error during key decryption:", error);
        throw error; // Rethrow the error to be caught by the calling code
    }
}

async function decryptMessageWithSymmetricKey(
    encryptedDataBase64,
    decryptedKey,
    ivBase64
)
{
    try
    {
        const encryptedDataBuffer = base64ToArrayBuffer(encryptedDataBase64);
        const ivBuffer = base64ToArrayBuffer(ivBase64);

        console.log("Got all the three ingredients to make this happen.");

        console.log("Encrypted data buffer:", encryptedDataBuffer);
        console.log("IV buffer:", ivBuffer);
        console.log("Decrypted key:", decryptedKey);

        console.log("symmetric key imported successfully.");

        // Decrypt the actual data
        const decryptedBuffer = await window.crypto.subtle.decrypt(
            {
                name: "AES-CBC",
                iv: ivBuffer,
            },
            decryptedKey,
            encryptedDataBuffer
        );

        console.log("Decrypted buffer:", decryptedBuffer);

        return new TextDecoder().decode(decryptedBuffer);
    }
    catch (error)
    {
        console.error("Error during decryption:", error);
        throw error;
    }
}

// Example usage
console.log("Starting function...");
const privateKeyBase64 = "<CLIENT_PRIVATE_KEY_BASE_64>";

const encryptedDataBase64 = "<SERVER_ENCRYPTED_DATA_BASE_64>";

// This is the AES Key
const encryptedKeyBase64 = "<ENCRYPTED_AES_KEY_BASE_64>";

const ivBase64 = "<INITIALIZATION_VECTOR_BASE_64>";

try
{
    const privateKey = await importPrivateKey(privateKeyBase64);
    console.log("Private key imported successfully.");

    // decryption of AES key starts here.
    console.log("decryption of AES key starts here.");

    const AESKeyBuffer = await decryptSymmetricKey(
        privateKey,
        encryptedKeyBase64
    );

    console.log("Decrypted key buffer length:", AESKeyBuffer.byteLength);
    console.log(
        "First few bytes of decrypted key buffer:",
        Array.from(new Uint8Array(AESKeyBuffer.slice(0, 10)))
    );

    const AESKey = await importAESKey(AESKeyBuffer);

    const decryptedMessage = await decryptMessageWithSymmetricKey(
        encryptedDataBase64,
        AESKey,
        ivBase64
    );
    console.log("Decrypted message:", decryptedMessage);
}
catch (error)
{
    console.error("Error decrypting message:", error);
}
