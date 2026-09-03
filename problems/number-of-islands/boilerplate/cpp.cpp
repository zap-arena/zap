#include <iostream>
#include <string>
#include <vector>

using namespace std;

int numIslands(vector<string>& grid) {
    // TODO: implement
    return 0;
}

int main() {
    int rows, cols;
    if (!(cin >> rows >> cols)) return 0;
    vector<string> grid(rows);
    for (int r = 0; r < rows; ++r) cin >> grid[r];

    cout << numIslands(grid) << '\n';
    return 0;
}
