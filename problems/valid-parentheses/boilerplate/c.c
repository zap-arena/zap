#include <stdio.h>
#include <string.h>

#define MAXN 10005

/* TODO: implement, returning 1 for valid and 0 otherwise */
int is_valid(const char *s) {
    (void)s;
    return 0;
}

int main(void) {
    char s[MAXN];
    if (!fgets(s, sizeof(s), stdin)) s[0] = '\0';
    s[strcspn(s, "\r\n")] = '\0';

    printf("%s\n", is_valid(s) ? "true" : "false");
    return 0;
}
