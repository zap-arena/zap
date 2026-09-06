#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    
    int* arr = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    int K = 0;
    scanf("%d", &K);
    
    // TODO: Write your solution for Stage 1 here
    // Find the maximum amount of money you can rob (no adjacent houses).
    
    printf("0\n");
    free(arr);
    return 0;
}
