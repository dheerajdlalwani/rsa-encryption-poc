import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import javax.crypto.Cipher;
import java.util.Base64;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.io.IOException;

public class GenerateServerPublicAndPrivateKeys {
    public static void main(String[] args) throws Exception {
        System.out.println("Getting RSA Key Pair Generator instance.");
        KeyPairGenerator keyPairGenerator = null;
        try {
            keyPairGenerator = KeyPairGenerator.getInstance("RSA");

            System.out.println("Initializing an 8192 bit RSA key...");
            keyPairGenerator.initialize(8192);

            System.out.println("Generating the key pair...");
            KeyPair keyPair = keyPairGenerator.generateKeyPair();

            System.out.println("Getting public key...");
            PublicKey serverPublicKey = keyPair.getPublic();

            System.out.println("Getting private key...");
            PrivateKey serverPrivateKey = keyPair.getPrivate();

            System.out.println("Encoding public key to base 64");
            String publicKeyBase64 = Base64.getEncoder().encodeToString(serverPublicKey.getEncoded());

            System.out.println("Encoding private key to base 64");
            String privateKeyBase64 = Base64.getEncoder().encodeToString(serverPrivateKey.getEncoded());

            try {
                System.out.println("Writing public key to server-public-key.txt");
                Files.write(Paths.get("../keys/server-public-key.txt"), publicKeyBase64.getBytes(), StandardOpenOption.CREATE);
                System.out.println("Public key saved to server-public-key.txt");

                System.out.println("Writing private key to server-private-key.txt");
                Files.write(Paths.get("../keys/server-private-key.txt"), privateKeyBase64.getBytes(), StandardOpenOption.CREATE);
                System.out.println("Private key saved to server-private-key.txt");

            } catch (IOException e) {
                System.out.println("Could not write to file.");
                e.printStackTrace();
            }
        } catch (NoSuchAlgorithmException e) {
            System.out.println("RSA algorithm not available.");
            e.printStackTrace();
        } finally {
            if (keyPairGenerator != null) {
                keyPairGenerator = null; // closing the generator
            }
        }
        System.out.println("Done.");
    }
}
