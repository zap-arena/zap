#include <iostream>
#include <vector>

using namespace std;

vector<int> merge(const vector<int>& a, const vector<int>& b) {
    // TODO: implement
    return {};
}

int main() {
    int m;
    if (!(cin >> m)) return 0;
    vector<int> a(m);
    for (int i = 0; i < m; ++i) cin >> a[i];
    int n;
    cin >> n;
    vector<int> b(n);
    for (int i = 0; i < n; ++i) cin >> b[i];

    vector<int> ans = merge(a, b);
    for (size_t i = 0; i < ans.size(); ++i) {
        if (i) cout << ' ';
        cout << ans[i];
    }
    cout << '\n';
    return 0;
}
