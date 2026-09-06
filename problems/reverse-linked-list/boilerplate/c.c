#include <stdio.h>
#include <stdlib.h>

struct ListNode {
    int val;
    struct ListNode *next;
};

/* TODO: reverse the list and return the new head */
struct ListNode *reverse_list(struct ListNode *head) {
    return head;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 0;

    int *vals = (int *)malloc(sizeof(int) * (size_t)(n > 0 ? n : 1));
    for (int i = 0; i < n; ++i) {
        if (scanf("%d", &vals[i]) != 1) break;
    }

    struct ListNode *head = NULL;
    for (int i = n - 1; i >= 0; --i) {
        struct ListNode *node = (struct ListNode *)malloc(sizeof(struct ListNode));
        node->val = vals[i];
        node->next = head;
        head = node;
    }

    int first = 1;
    for (struct ListNode *node = reverse_list(head); node != NULL; node = node->next) {
        if (!first) printf(" ");
        printf("%d", node->val);
        first = 0;
    }
    printf("\n");

    free(vals);
    return 0;
}
