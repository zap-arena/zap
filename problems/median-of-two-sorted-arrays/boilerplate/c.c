#include <stdio.h>
#include <stdlib.h>

/* TODO: implement and return the median */
double find_median_sorted_arrays(const int *a, int m, const int *b, int n) {
    (void)a;
    (void)m;
    (void)b;
    (void)n;
    return 0.0;
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

    printf("%.5f\n", find_median_sorted_arrays(a, m, b, n));

    free(a);
    free(b);
    return 0;
}
