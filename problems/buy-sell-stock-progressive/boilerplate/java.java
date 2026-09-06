import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (!scanner.hasNextInt()) return;
        
        int n = scanner.nextInt();
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) {
            prices[i] = scanner.nextInt();
        }
        int F = scanner.hasNextInt() ? scanner.nextInt() : 0;
        int K = scanner.hasNextInt() ? scanner.nextInt() : 0;
        
        // TODO: Write your solution for Stage 1 here
        // Find the maximum profit you can achieve with exactly one transaction.
        
        System.out.println(0);
    }
}
