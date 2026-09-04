#include <iostream>
#include <string>

using namespace std;

bool isPalindrome(const string& s) {
    // TODO: implement
    return false;
}

int main() {
    string s;
    getline(cin, s);
    cout << (isPalindrome(s) ? "true" : "false") << '\n';
    return 0;
}
