#include <stdio.h>
#include <stdlib.h>

/* TODO: implement and return the index of target, or -1 */
int search(const int *nums, int n, int target) {
    (void)nums;
    (void)n;
    (void)target;
    return -1;
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

    printf("%d\n", search(nums, n, target));

    free(nums);
    return 0;
}
