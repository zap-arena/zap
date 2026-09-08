#include <cstdio>
#include <iostream>
#include <vector>

using namespace std;

double findMedianSortedArrays(const vector<int>& a, const vector<int>& b) {
    // TODO: implement
    return 0.0;
}

int main() {
    int m;
    if (!(cin >> m)) return 0;
    vector<int> a(m);
    for (int i = 0; i < m; ++i) cin >> a[i];
    int n;
    cin >> n;
    vector<int> b(n);
    for (int i = 0; i < n; ++i) cin >> b[i];

    printf("%.5f\n", findMedianSortedArrays(a, b));
    return 0;
}
