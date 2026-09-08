#include <iostream>
#include <vector>

using namespace std;

int maxProfit(const vector<int>& prices) {
    // TODO: implement
    return 0;
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> prices(n);
    for (int i = 0; i < n; ++i) cin >> prices[i];

    cout << maxProfit(prices) << '\n';
    return 0;
}
