#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    
    int* prices = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        scanf("%d", &prices[i]);
    }
    
    int F = 0, K = 0;
    scanf("%d %d", &F, &K);
    
    // TODO: Write your solution for Stage 1 here
    // Find the maximum profit you can achieve with exactly one transaction.
    
    printf("0\n");
    free(prices);
    return 0;
}
