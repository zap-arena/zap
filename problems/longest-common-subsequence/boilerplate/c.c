#include <stdio.h>
#include <string.h>

#define MAXN 1005

/* TODO: implement and return the LCS length */
int longest_common_subsequence(const char *a, const char *b) {
    (void)a;
    (void)b;
    return 0;
}

int main(void) {
    static char a[MAXN], b[MAXN];
    if (!fgets(a, sizeof(a), stdin)) a[0] = '\0';
    if (!fgets(b, sizeof(b), stdin)) b[0] = '\0';
    a[strcspn(a, "\r\n")] = '\0';
    b[strcspn(b, "\r\n")] = '\0';

    printf("%d\n", longest_common_subsequence(a, b));
    return 0;
}
