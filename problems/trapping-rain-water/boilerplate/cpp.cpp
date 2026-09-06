#include <iostream>
#include <vector>

using namespace std;

long long trap(const vector<int>& height) {
    // TODO: implement
    return 0;
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> height(n);
    for (int i = 0; i < n; ++i) cin >> height[i];

    cout << trap(height) << '\n';
    return 0;
}
