#include <iostream>
#include <vector>

using namespace std;

vector<int> twoSum(const vector<int>& nums, int target) {
    // TODO: implement and return the two indices
    return {};
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; ++i) cin >> nums[i];
    int target;
    cin >> target;

    vector<int> ans = twoSum(nums, target);
    for (size_t i = 0; i < ans.size(); ++i) {
        if (i) cout << ' ';
        cout << ans[i];
    }
    cout << '\n';
    return 0;
}
