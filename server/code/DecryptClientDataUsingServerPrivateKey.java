import javax.crypto.Cipher;
import javax.crypto.spec.OAEPParameterSpec;
import java.security.spec.MGF1ParameterSpec;
import javax.crypto.spec.PSource;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

public class DecryptClientDataUsingServerPrivateKey {
    public static void main(String[] args) throws Exception {
        // Read private key from file
        String privateKeyBase64 = new String(Files.readAllBytes(Paths.get("../keys/server-private-key.txt")));

        // Read encrypted data from file
        String encryptedData = new String(Files.readAllBytes(Paths.get("../data/client-encrypted-data.txt")));

        // Decode base64 encoded private key
        byte[] privateKeyBytes = Base64.getDecoder().decode(privateKeyBase64);

        // Create key spec
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(privateKeyBytes);

        // Get RSA KeyFactory
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");

        // Generate private key
        PrivateKey privateKey = keyFactory.generatePrivate(keySpec);

        // Initialize Cipher with RSA algorithm and OAEP padding
        Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-1AndMGF1Padding");

        // Specify OAEPParameterSpec with SHA-256 for both main hash and MGF1 padding
        OAEPParameterSpec oaepParams = new OAEPParameterSpec("SHA-1", "MGF1", new MGF1ParameterSpec("SHA-1"), PSource.PSpecified.DEFAULT);

        // Initialize cipher for decryption with private key and OAEPParameterSpec
        cipher.init(Cipher.DECRYPT_MODE, privateKey, oaepParams);

        // Decrypt the data
        byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedData));

        // Convert decrypted bytes to string
        String decryptedData = new String(decryptedBytes);

        // Write decrypted data to file
        Files.write(Paths.get("../data/client-decrypted-data.txt"), decryptedData.getBytes(), StandardOpenOption.CREATE);

        // Output success message
        System.out.println("Decrypted data saved to client-decrypted-data.txt");
    }
}
