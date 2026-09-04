#include <stdio.h>
#include <stdlib.h>

/* TODO: implement and return the maximum profit */
int max_profit(const int *prices, int n) {
    (void)prices;
    (void)n;
    return 0;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 0;

    int *prices = (int *)malloc(sizeof(int) * (size_t)n);
    for (int i = 0; i < n; ++i) {
        if (scanf("%d", &prices[i]) != 1) break;
    }

    printf("%d\n", max_profit(prices, n));

    free(prices);
    return 0;
}
