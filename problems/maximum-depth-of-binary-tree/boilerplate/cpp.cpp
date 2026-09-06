#include <iostream>
#include <vector>

using namespace std;

int maxDepth(const vector<int>& tree, int index = 0) {
    // TODO: implement; tree[i] == -1 means the node is missing,
    // children of i are at 2*i+1 and 2*i+2
    return 0;
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> tree(n);
    for (int i = 0; i < n; ++i) cin >> tree[i];

    cout << maxDepth(tree) << '\n';
    return 0;
}
