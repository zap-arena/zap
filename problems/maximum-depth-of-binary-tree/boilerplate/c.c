#include <stdio.h>
#include <stdlib.h>

/* TODO: implement; tree[i] == -1 means the node is missing,
   children of i are at 2*i+1 and 2*i+2 */
int max_depth(const int *tree, int n, int index) {
    (void)tree;
    (void)n;
    (void)index;
    return 0;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 0;

    int *tree = (int *)malloc(sizeof(int) * (size_t)n);
    for (int i = 0; i < n; ++i) {
        if (scanf("%d", &tree[i]) != 1) break;
    }

    printf("%d\n", max_depth(tree, n, 0));

    free(tree);
    return 0;
}
