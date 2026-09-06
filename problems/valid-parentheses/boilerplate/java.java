import java.util.Scanner;

public class Main {

    static boolean isValid(String s) {
        // TODO: implement
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine().trim() : "";
        System.out.println(isValid(s) ? "true" : "false");
    }
}
