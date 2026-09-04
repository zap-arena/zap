import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.StreamTokenizer;

public class Main {

    static int coinChange(int[] coins, int amount) {
        // TODO: implement
        return -1;
    }

    public static void main(String[] args) throws Exception {
        StreamTokenizer in = new StreamTokenizer(new BufferedReader(new InputStreamReader(System.in)));
        in.nextToken();
        int n = (int) in.nval;
        int[] coins = new int[n];
        for (int i = 0; i < n; i++) {
            in.nextToken();
            coins[i] = (int) in.nval;
        }
        in.nextToken();
        int amount = (int) in.nval;
        System.out.println(coinChange(coins, amount));
    }
}
