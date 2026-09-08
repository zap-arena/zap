#include <stdio.h>
#include <string.h>

#define MAXN 200005

/* TODO: implement, returning 1 for a palindrome and 0 otherwise */
int is_palindrome(const char *s) {
    (void)s;
    return 0;
}

int main(void) {
    static char s[MAXN];
    if (!fgets(s, sizeof(s), stdin)) s[0] = '\0';
    s[strcspn(s, "\r\n")] = '\0';

    printf("%s\n", is_palindrome(s) ? "true" : "false");
    return 0;
}
