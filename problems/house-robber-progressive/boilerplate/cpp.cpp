#include <iostream>
#include <vector>

using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    
    vector<int> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    int K = 0;
    if (cin >> K) {}
    
    // TODO: Write your solution for Stage 1 here
    // Find the maximum amount of money you can rob (no adjacent houses).
    
    cout << 0 << endl;
    return 0;
}
