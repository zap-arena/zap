#include <iostream>
#include <vector>

using namespace std;

int coinChange(const vector<int>& coins, int amount) {
    // TODO: implement
    return -1;
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> coins(n);
    for (int i = 0; i < n; ++i) cin >> coins[i];
    int amount;
    cin >> amount;

    cout << coinChange(coins, amount) << '\n';
    return 0;
}
