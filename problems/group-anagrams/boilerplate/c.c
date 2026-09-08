#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAXN 10005
#define MAXW 105

/* TODO: group the words and print one group per line.
   Sort each group lexicographically and order groups by their first word. */
void group_anagrams(char words[][MAXW], int n) {
    (void)words;
    (void)n;
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int c;
    while ((c = getchar()) != '\n' && c != EOF) { }

    static char words[MAXN][MAXW];
    for (int i = 0; i < n; ++i) {
        if (!fgets(words[i], MAXW, stdin)) words[i][0] = '\0';
        words[i][strcspn(words[i], "\r\n")] = '\0';
    }

    group_anagrams(words, n);
    return 0;
}
