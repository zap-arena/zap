import java.util.List;
import java.util.Scanner;

public class Main {

    static List<String> fizzBuzz(int n) {
        // TODO: implement and return the n output lines
        return List.of();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();

        StringBuilder sb = new StringBuilder();
        for (String line : fizzBuzz(n)) {
            sb.append(line).append('\n');
        }
        System.out.print(sb);
    }
}
