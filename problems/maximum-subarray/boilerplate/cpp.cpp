#include <iostream>
#include <vector>

using namespace std;

long long maxSubArray(const vector<int>& nums) {
    // TODO: implement
    return 0;
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; ++i) cin >> nums[i];

    cout << maxSubArray(nums) << '\n';
    return 0;
}
