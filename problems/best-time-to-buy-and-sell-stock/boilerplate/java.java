import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.StreamTokenizer;

public class Main {

    static int maxProfit(int[] prices) {
        // TODO: implement
        return 0;
    }

    public static void main(String[] args) throws Exception {
        StreamTokenizer in = new StreamTokenizer(new BufferedReader(new InputStreamReader(System.in)));
        in.nextToken();
        int n = (int) in.nval;
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) {
            in.nextToken();
            prices[i] = (int) in.nval;
        }
        System.out.println(maxProfit(prices));
    }
}
