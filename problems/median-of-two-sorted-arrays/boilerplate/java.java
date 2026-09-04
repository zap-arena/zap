import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.StreamTokenizer;
import java.util.Locale;

public class Main {

    static double findMedianSortedArrays(int[] a, int[] b) {
        // TODO: implement
        return 0.0;
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
        System.out.printf(Locale.ROOT, "%.5f%n", findMedianSortedArrays(a, b));
    }
}
