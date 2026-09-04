#include <iostream>
#include <string>
#include <vector>

using namespace std;

vector<vector<string>> groupAnagrams(vector<string>& words) {
    // TODO: return the groups, each sorted, ordered by first word
    return {};
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    cin.ignore();
    vector<string> words(n);
    for (int i = 0; i < n; ++i) getline(cin, words[i]);

    vector<vector<string>> groups = groupAnagrams(words);
    for (const auto& group : groups) {
        for (size_t i = 0; i < group.size(); ++i) {
            if (i) cout << ' ';
            cout << group[i];
        }
        cout << '\n';
    }
    return 0;
}
