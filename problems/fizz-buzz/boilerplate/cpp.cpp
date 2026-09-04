#include <iostream>
#include <string>
#include <vector>

using namespace std;

vector<string> fizzBuzz(int n) {
    // TODO: implement and return the n output lines
    return {};
}

int main() {
    int n;
    if (!(cin >> n)) return 0;

    vector<string> lines = fizzBuzz(n);
    for (const string& line : lines) {
        cout << line << '\n';
    }
    return 0;
}
