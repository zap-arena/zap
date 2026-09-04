import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.StreamTokenizer;

public class Main {

    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    static ListNode reverseList(ListNode head) {
        // TODO: reverse the list and return the new head
        return head;
    }

    public static void main(String[] args) throws Exception {
        StreamTokenizer in = new StreamTokenizer(new BufferedReader(new InputStreamReader(System.in)));
        in.nextToken();
        int n = (int) in.nval;
        int[] vals = new int[n];
        for (int i = 0; i < n; i++) {
            in.nextToken();
            vals[i] = (int) in.nval;
        }

        ListNode head = null;
        for (int i = n - 1; i >= 0; i--) {
            ListNode node = new ListNode(vals[i]);
            node.next = head;
            head = node;
        }

        StringBuilder sb = new StringBuilder();
        for (ListNode node = reverseList(head); node != null; node = node.next) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(node.val);
        }
        System.out.println(sb.toString());
    }
}
