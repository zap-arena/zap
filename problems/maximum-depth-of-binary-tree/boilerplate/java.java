import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.StreamTokenizer;

public class Main {

    static int maxDepth(int[] tree, int index) {
        // TODO: implement; tree[i] == -1 means the node is missing,
        // children of i are at 2*i+1 and 2*i+2
        return 0;
    }

    public static void main(String[] args) throws Exception {
        StreamTokenizer in = new StreamTokenizer(new BufferedReader(new InputStreamReader(System.in)));
        in.nextToken();
        int n = (int) in.nval;
        int[] tree = new int[n];
        for (int i = 0; i < n; i++) {
            in.nextToken();
            tree[i] = (int) in.nval;
        }
        System.out.println(maxDepth(tree, 0));
    }
}
