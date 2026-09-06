#include <stdio.h>

#define MAXCOINS 12

/* TODO: implement and return the minimum coin count, or -1 */
int coin_change(const int *coins, int n, int amount) {
    (void)coins;
    (void)n;
    (void)amount;
    return -1;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 0;

    int coins[MAXCOINS];
    for (int i = 0; i < n && i < MAXCOINS; ++i) {
        if (scanf("%d", &coins[i]) != 1) break;
    }
    int amount;
    if (scanf("%d", &amount) != 1) amount = 0;

    printf("%d\n", coin_change(coins, n, amount));
    return 0;
}
