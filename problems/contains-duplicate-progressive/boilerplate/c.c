#include <stdio.h>
#include <stdlib.h>

long solve(long *nums, int n) {
    // TODO: implement the logic described in the current stage's statement
    return 0;
}

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    long *nums = malloc(sizeof(long) * n);
    for (int i = 0; i < n; i++) scanf("%ld", &nums[i]);
    printf("%ld\n", solve(nums, n));
    free(nums);
    return 0;
}
