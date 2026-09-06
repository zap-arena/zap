import java.io.BufferedReader;
import java.io.InputStreamReader;

public class Main {

    static int numIslands(char[][] grid) {
        // TODO: implement
        return 0;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String[] head = br.readLine().trim().split("\\s+");
        int rows = Integer.parseInt(head[0]);
        int cols = Integer.parseInt(head[1]);
        char[][] grid = new char[rows][cols];
        for (int r = 0; r < rows; r++) {
            String line = br.readLine().trim();
            for (int c = 0; c < cols; c++) {
                grid[r][c] = line.charAt(c);
            }
        }
        System.out.println(numIslands(grid));
    }
}
