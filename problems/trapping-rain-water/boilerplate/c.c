#include <stdio.h>
#include <stdlib.h>

/* TODO: implement and return the trapped water */
long long trap(const int *height, int n) {
    (void)height;
    (void)n;
    return 0;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 0;

    int *height = (int *)malloc(sizeof(int) * (size_t)n);
    for (int i = 0; i < n; ++i) {
        if (scanf("%d", &height[i]) != 1) break;
    }

    printf("%lld\n", trap(height, n));

    free(height);
    return 0;
}
