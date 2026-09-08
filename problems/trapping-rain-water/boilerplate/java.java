import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.StreamTokenizer;

public class Main {

    static long trap(int[] height) {
        // TODO: implement
        return 0;
    }

    public static void main(String[] args) throws Exception {
        StreamTokenizer in = new StreamTokenizer(new BufferedReader(new InputStreamReader(System.in)));
        in.nextToken();
        int n = (int) in.nval;
        int[] height = new int[n];
        for (int i = 0; i < n; i++) {
            in.nextToken();
            height[i] = (int) in.nval;
        }
        System.out.println(trap(height));
    }
}
