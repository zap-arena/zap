#include <stdio.h>
#include <stdlib.h>

/* TODO: implement and return the maximum subarray sum */
long long max_subarray(const int *nums, int n) {
    (void)nums;
    (void)n;
    return 0;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 0;

    int *nums = (int *)malloc(sizeof(int) * (size_t)n);
    for (int i = 0; i < n; ++i) {
        if (scanf("%d", &nums[i]) != 1) break;
    }

    printf("%lld\n", max_subarray(nums, n));

    free(nums);
    return 0;
}
