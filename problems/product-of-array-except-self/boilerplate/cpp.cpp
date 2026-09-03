#include <iostream>
#include <vector>

using namespace std;

vector<long long> productExceptSelf(const vector<int>& nums) {
    // TODO: implement without using division
    return {};
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; ++i) cin >> nums[i];

    vector<long long> ans = productExceptSelf(nums);
    for (size_t i = 0; i < ans.size(); ++i) {
        if (i) cout << ' ';
        cout << ans[i];
    }
    cout << '\n';
    return 0;
}
