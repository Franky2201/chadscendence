# Team Workflow

For this project, we are using **Trunk-Based Development**. This means we only have one permanent branch: `main`. All new work is done on temporary feature branches and merged into `main` via a Pull Request (PR).

---

## Step-by-Step Guide

### 1. Sync Your Local Machine
Before starting new work, ensure your local environment matches the latest approved code.
```bash
git checkout main
git pull origin main
```

### 2. Create a Working Branch
Create a new branch for your specific task using the strict naming convention: `type/id-short-description`.

**Allowed Branch Types:**
*   `chore`: Technical tasks / Setup
*   `feat`: New features
*   `fix`: Bug fixes

**Examples:**
```bash
git checkout -b feat/12-login-page
git checkout -b chore/2-setup-docker-db
git checkout -b fix/45-chat-websocket-crash
```

### 3. Development & Testing
Work on your code. Write tests using Jest and Vitest (**OPTIONAL**). Before committing, run ci commands locally to catch errors early.
```bash
make ci
```

### 4. Stage, Commit and Push
When committing, use the strict commit naming convention: `type: short description (#id)`.
```bash
git add .
git commit -m "feat: add github button (#12)"
git push origin feat/12-login-page
```

### 5. Open a Pull Request (PR)
1. Go to the repository on **GitHub.com**.
2. Click the green **"Compare & pull request"** button that appears at the top.
3. Add a title and a brief description of your changes.
    *   ⚠️ **Important:** In the description, you must write `Closes #ID` (e.g., `Closes #12`) to automatically close the associated issue when the PR is merged.
4. This triggers the **CI pipeline**. The system will automatically install your code and run tests to ensure nothing is broken.

### 6. Merge and Cleanup
* **If CI fails (Red X) or changes are requested:** Check the logs, fix the code locally, commit, and `git push` again. The PR updates automatically.
* **If CI passes (Green Check):** You can click **Merge Pull Request** on GitHub to merge the branch into `main`.
* **Cleanup:** Delete the branch on GitHub and locally to keep your workspace tidy using the `-D` flag:
```bash
git checkout main
git pull origin main
git branch -D feat/12-login-page
```
