import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Main {

    static int longestCommonSubsequence(String a, String b) {
        // TODO: implement
        return 0;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String a = br.readLine();
        String b = br.readLine();
        if (a == null) a = "";
        if (b == null) b = "";
        System.out.println(longestCommonSubsequence(a.trim(), b.trim()));
    }
}
