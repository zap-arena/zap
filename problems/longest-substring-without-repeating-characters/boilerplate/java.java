import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Main {

    static int lengthOfLongestSubstring(String s) {
        // TODO: implement
        return 0;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        String s = (line == null) ? "" : line;
        System.out.println(lengthOfLongestSubstring(s));
    }
}
