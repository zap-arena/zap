import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Main {

    static boolean isPalindrome(String s) {
        // TODO: implement
        return false;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        String s = (line == null) ? "" : line;
        System.out.println(isPalindrome(s) ? "true" : "false");
    }
}
