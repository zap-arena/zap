#include <stdio.h>

#define MAXR 305
#define MAXC 305

static char grid[MAXR][MAXC];

/* TODO: implement and return the number of islands */
int num_islands(int rows, int cols) {
    (void)rows;
    (void)cols;
    return 0;
}

int main(void) {
    int rows, cols;
    if (scanf("%d %d", &rows, &cols) != 2) return 0;
    for (int r = 0; r < rows; ++r) {
        if (scanf("%s", grid[r]) != 1) break;
    }

    printf("%d\n", num_islands(rows, cols));
    return 0;
}
