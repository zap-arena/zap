#include <iostream>
#include <string>

using namespace std;

bool isValid(const string& s) {
    // TODO: implement
    return false;
}

int main() {
    string s;
    getline(cin, s);
    cout << (isValid(s) ? "true" : "false") << '\n';
    return 0;
}
