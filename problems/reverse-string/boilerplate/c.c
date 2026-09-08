#include <stdio.h>
#include <string.h>

#define MAX_LEN 100005

/* TODO: implement, reversing s in place */
void reverse_string(char *s) {
    (void)s;
}

int main(void) {
    static char s[MAX_LEN];
    if (!fgets(s, sizeof(s), stdin)) return 0;

    size_t len = strlen(s);
    if (len > 0 && s[len - 1] == '\n') s[len - 1] = '\0';

    reverse_string(s);
    printf("%s\n", s);
    return 0;
}
