#include <stdio.h>
#include <stdlib.h>

/* TODO: implement, writing m + n sorted values into out */
void merge(const int *a, int m, const int *b, int n, int *out) {
    (void)a;
    (void)m;
    (void)b;
    (void)n;
    (void)out;
}

int main(void) {
    int m;
    if (scanf("%d", &m) != 1) return 0;
    int *a = (int *)malloc(sizeof(int) * (size_t)(m > 0 ? m : 1));
    for (int i = 0; i < m; ++i) {
        if (scanf("%d", &a[i]) != 1) break;
    }

    int n;
    if (scanf("%d", &n) != 1) n = 0;
    int *b = (int *)malloc(sizeof(int) * (size_t)(n > 0 ? n : 1));
    for (int i = 0; i < n; ++i) {
        if (scanf("%d", &b[i]) != 1) break;
    }

    int total = m + n;
    int *out = (int *)malloc(sizeof(int) * (size_t)(total > 0 ? total : 1));
    merge(a, m, b, n, out);

    for (int i = 0; i < total; ++i) {
        if (i) printf(" ");
        printf("%d", out[i]);
    }
    printf("\n");

    free(a);
    free(b);
    free(out);
    return 0;
}
