#include <stdio.h>
#include <stdlib.h>

/* TODO: implement without using division, writing n values into out */
void product_except_self(const int *nums, int n, long long *out) {
    (void)nums;
    (void)n;
    (void)out;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 0;

    int *nums = (int *)malloc(sizeof(int) * (size_t)n);
    for (int i = 0; i < n; ++i) {
        if (scanf("%d", &nums[i]) != 1) break;
    }
    long long *out = (long long *)calloc((size_t)n, sizeof(long long));

    product_except_self(nums, n, out);
    for (int i = 0; i < n; ++i) {
        if (i) printf(" ");
        printf("%lld", out[i]);
    }
    printf("\n");

    free(nums);
    free(out);
    return 0;
}
