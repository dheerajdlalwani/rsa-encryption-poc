import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import javax.crypto.Cipher;
import java.nio.file.StandardOpenOption;
import java.io.IOException;

public class EncryptServerDataUsingClientPublicKey {
    public static void main(String[] args) throws Exception {
        // Read public key from file
        String clientPublicKeyBase64 = new String(Files.readAllBytes(Paths.get("../keys/client-public-key.txt")));

        // Decode base64 encoded public key
        byte[] publicKeyBytes = Base64.getDecoder().decode(clientPublicKeyBase64);

        // Create key spec
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKeyBytes);

        // Get RSA KeyFactory
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");

        // Generate public key
        PublicKey clientPublicKey = keyFactory.generatePublic(keySpec);

        // Initialize Cipher with RSA algorithm
        Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-1AndMGF1Padding");

        // Initialize cipher for encryption with public key
        cipher.init(Cipher.ENCRYPT_MODE, clientPublicKey);

        // Plaintext data to encrypt
        String serverPlainTextData = new String(Files.readAllBytes(Paths.get("../data/server-plaintext-data.txt")));

        // Encrypt the data
        byte[] encryptedBytes = cipher.doFinal(serverPlainTextData.getBytes(StandardCharsets.UTF_8));

        // Encode encrypted bytes to base64
        String serverEncryptedData = Base64.getEncoder().encodeToString(encryptedBytes);

        // Write encrypted data to file
        try {
            System.out.println("Writing encrypted data to server-encrypted-data.txt");
            Files.write(Paths.get("../data/server-encrypted-data.txt"), serverEncryptedData.getBytes(), StandardOpenOption.CREATE);
            System.out.println("Encrypted data saved to server-encrypted-data.txt");
        } catch (IOException e) {
                System.out.println("Could not write to file.");
                e.printStackTrace();
        }
    }
}
