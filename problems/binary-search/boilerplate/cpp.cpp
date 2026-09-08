#include <iostream>
#include <vector>

using namespace std;

int search(const vector<int>& nums, int target) {
    // TODO: implement
    return -1;
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; ++i) cin >> nums[i];
    int target;
    cin >> target;

    cout << search(nums, target) << '\n';
    return 0;
}
