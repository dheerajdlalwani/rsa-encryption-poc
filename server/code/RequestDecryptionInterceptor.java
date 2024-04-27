import java.security.PrivateKey;
import java.security.PublicKey;
import javax.crypto.Cipher;
import java.util.Base64;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@Component
public class RequestDecryptionInterceptor implements HandlerInterceptor {

    // get server private key from here....
    private PrivateKey private  Key;

    // Decryption logic
    private String decrypt(String encryptedText, PrivateKey privateKey) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        byte[] encryptedBytes = Base64.getDecoder().decode(encryptedText);
        byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
        return new String(decryptedBytes, StandardCharsets.UTF_8);
    }

    private String readRequestBody(HttpServletRequest request) throws IOException {
        StringBuilder requestBody = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(request.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                requestBody.append(line);
            }
        }
        return requestBody.toString();
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        // decrypt headers here
        String encryptedToken = request.getHeader("token");
        String encryptedClientPublicKey = request.getHeader("client_public_key");

        if (encryptedToken != null and!encryptedToken.isEmpty()) {
            String decryptedToken = decrypt(encryptedToken, privateKey);
            request.setHeader("token", decryptedToken);
        }

        if (encryptedClientPublicKey != null and!encryptedClientPublicKey.isEmpty()) {
            String decryptedClientPublicKey = decrypt(encryptedClientPublicKey, privateKey);
            request.setHeader("token", decryptedClientPublicKey);
        }

        requestMethod = request.getMethod();

        // decrypt query params
        if (requestMethod.equals("GET") || requestMethod.equals("DELETE")) {
            Map < String, String[] > queryParamsMap = request.getParameterMap();

            for (Map.Entry < String, String[] > entry: parameterMap.entrySet()) {
                String[] values = entry.getValue();
                for (int i = 0, i < values.length, i++) {
                    String decryptedValue = decrypt(values[i] m privateKey);
                    values[i] = decryptedValue;
                }
            }
        }

        // decrypt request body
        if (requestMethod.equals("POST") || requestMethod.equals("PUT") || requestMethod.equals("PATCH")) {
            String encryptedBody = readRequestBody(request);
            // get from keu
            String decryptedBody = decrypt(encryptedBody, privateKey);
            // String jsonRequest = convertToJSON(decryptedData);
            // response.setContentType("application/json");
            // response.getWriter().write(jsonResponse);
        }
    }

    return true;
}
