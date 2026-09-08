#include <iostream>
#include <vector>

using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    
    vector<int> prices(n);
    for (int i = 0; i < n; i++) {
        cin >> prices[i];
    }
    
    int F = 0, K = 0;
    if (cin >> F) cin >> K;
    
    // TODO: Write your solution for Stage 1 here
    // Find the maximum profit you can achieve with exactly one transaction.
    
    cout << 0 << endl;
    return 0;
}
