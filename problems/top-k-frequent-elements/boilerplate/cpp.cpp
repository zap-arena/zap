#include <iostream>
#include <vector>

using namespace std;

vector<int> topKFrequent(const vector<int>& nums, int k) {
    // TODO: implement (frequency desc, then value asc)
    return {};
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; ++i) cin >> nums[i];
    int k;
    cin >> k;

    vector<int> ans = topKFrequent(nums, k);
    for (size_t i = 0; i < ans.size(); ++i) {
        if (i) cout << ' ';
        cout << ans[i];
    }
    cout << '\n';
    return 0;
}
