import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (!scanner.hasNextInt()) return;
        
        int n = scanner.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }
        int K = scanner.hasNextInt() ? scanner.nextInt() : 0;
        
        // TODO: Write your solution for Stage 1 here
        // Find the maximum amount of money you can rob (no adjacent houses).
        
        System.out.println(0);
    }
}
