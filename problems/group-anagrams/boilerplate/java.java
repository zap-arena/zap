import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class Main {

    static List<List<String>> groupAnagrams(String[] words) {
        // TODO: return the groups, each sorted, ordered by first word
        return new ArrayList<>();
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(br.readLine().trim());
        String[] words = new String[n];
        for (int i = 0; i < n; i++) {
            String line = br.readLine();
            words[i] = (line == null) ? "" : line.trim();
        }

        StringBuilder sb = new StringBuilder();
        for (List<String> group : groupAnagrams(words)) {
            sb.append(String.join(" ", group)).append('\n');
        }
        System.out.print(sb.toString());
    }
}
