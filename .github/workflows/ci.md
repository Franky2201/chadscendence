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

### 2. Create a Feature Branch
Create a new branch for your specific task. Use descriptive prefixes like `feature/` or `fix/`.
```bash
git checkout -b feature/your-feature-name
```

### 3. Development & Testing
Work on your code. Write tests using Jest. Before committing, run tests locally to catch errors early.
```bash
npm test
```

### 4. Stage, Commit and Push
```bash
git add .
git commit -m "message"
git push
```

### 5. Open a Pull Request (PR)
1. Go to the repository on **GitHub.com**.
2. Click the green **"Compare & pull request"** button that appears at the top.
3. Add a title and a brief description of your changes.
4. This triggers the **CI pipeline**. The system will automatically install your code and run tests to ensure nothing is broken.

### 6. Merge and Cleanup
* **If CI fails (Red X):** Check the logs, fix the code locally, commit, and `git push` again. The PR updates automatically.
* **If CI passes (Green Check):** Click **Merge Pull Request** on GitHub.
* **Cleanup:** Delete the branch on GitHub and locally to keep your workspace tidy:
```bash
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```
