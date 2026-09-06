import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.StreamTokenizer;

public class Main {

    static int[] merge(int[] a, int[] b) {
        // TODO: implement
        return new int[] {};
    }

    public static void main(String[] args) throws Exception {
        StreamTokenizer in = new StreamTokenizer(new BufferedReader(new InputStreamReader(System.in)));
        in.nextToken();
        int m = (int) in.nval;
        int[] a = new int[m];
        for (int i = 0; i < m; i++) {
            in.nextToken();
            a[i] = (int) in.nval;
        }
        in.nextToken();
        int n = (int) in.nval;
        int[] b = new int[n];
        for (int i = 0; i < n; i++) {
            in.nextToken();
            b[i] = (int) in.nval;
        }

        int[] ans = merge(a, b);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < ans.length; i++) {
            if (i > 0) sb.append(' ');
            sb.append(ans[i]);
        }
        System.out.println(sb.toString());
    }
}
