#include <stdio.h>
#include <stdlib.h>

/* TODO: implement, writing the two indices into *a and *b */
void two_sum(const int *nums, int n, int target, int *a, int *b) {
    (void)nums;
    (void)n;
    (void)target;
    *a = -1;
    *b = -1;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 0;

    int *nums = (int *)malloc(sizeof(int) * (size_t)n);
    for (int i = 0; i < n; ++i) {
        if (scanf("%d", &nums[i]) != 1) break;
    }
    int target;
    if (scanf("%d", &target) != 1) target = 0;

    int a, b;
    two_sum(nums, n, target, &a, &b);
    printf("%d %d\n", a, b);

    free(nums);
    return 0;
}
