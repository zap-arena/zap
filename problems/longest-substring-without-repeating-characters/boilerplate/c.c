#include <stdio.h>
#include <string.h>

#define MAXN 50005

/* TODO: implement and return the length */
int length_of_longest_substring(const char *s) {
    (void)s;
    return 0;
}

int main(void) {
    static char s[MAXN];
    if (!fgets(s, sizeof(s), stdin)) s[0] = '\0';
    s[strcspn(s, "\r\n")] = '\0';

    printf("%d\n", length_of_longest_substring(s));
    return 0;
}
