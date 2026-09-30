import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Add imports
imports = """
import QuizListPage from "./pages/QuizListPage";
import QuizTakingPage from "./pages/QuizTakingPage";
const AdminQuizzes = lazy(() => import("./pages/admin/AdminQuizzes"));
"""

content = content.replace('import { useAuth } from "./store/auth";', 'import { useAuth } from "./store/auth";\n' + imports)

# Add user routes
user_routes = """
          <Route path="/quizzes" element={<QuizListPage />} />
          <Route path="/quizzes/:id" element={<QuizTakingPage />} />
"""

content = content.replace('{/* Admin */}', user_routes + '\n          {/* Admin */}')

# Add admin route
admin_route = """
          <Route
            path="/admin/quizzes"
            element={
              <RequireAdmin>
                <AdminQuizzes />
              </RequireAdmin>
            }
          />
"""

content = content.replace('path="/admin/contests"', admin_route.strip() + '\n          <Route\n            path="/admin/contests"')


with open("src/App.tsx", "w") as f:
    f.write(content)

print("Updated App.tsx")
