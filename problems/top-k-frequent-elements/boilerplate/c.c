#include <stdio.h>
#include <stdlib.h>

/* TODO: implement, writing k values into out (frequency desc, then value asc) */
void top_k_frequent(const int *nums, int n, int k, int *out) {
    (void)nums;
    (void)n;
    (void)k;
    (void)out;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 0;

    int *nums = (int *)malloc(sizeof(int) * (size_t)n);
    for (int i = 0; i < n; ++i) {
        if (scanf("%d", &nums[i]) != 1) break;
    }
    int k;
    if (scanf("%d", &k) != 1) k = 0;

    int *out = (int *)calloc((size_t)(k > 0 ? k : 1), sizeof(int));
    top_k_frequent(nums, n, k, out);
    for (int i = 0; i < k; ++i) {
        if (i) printf(" ");
        printf("%d", out[i]);
    }
    printf("\n");

    free(nums);
    free(out);
    return 0;
}
