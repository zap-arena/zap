#include <iostream>
#include <vector>

using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v) : val(v), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    // TODO: reverse the list and return the new head
    return head;
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> vals(n);
    for (int i = 0; i < n; ++i) cin >> vals[i];

    ListNode* head = nullptr;
    for (int i = n - 1; i >= 0; --i) {
        ListNode* node = new ListNode(vals[i]);
        node->next = head;
        head = node;
    }

    bool first = true;
    for (ListNode* node = reverseList(head); node != nullptr; node = node->next) {
        if (!first) cout << ' ';
        cout << node->val;
        first = false;
    }
    cout << '\n';
    return 0;
}
