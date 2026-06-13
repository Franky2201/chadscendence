# Manual Testing Script

This document provides a consolidated, exhaustive manual testing script for verifying the application's functionality.

## 1. Authentication & Identity
* [ ] **Registration (Password Strength):** Create a new account. Verify the validation requires at least 8 characters, an Uppercase letter, a Lowercase letter, and a Number.
* [ ] **Registration (Error Handling):** Verify that passwords failing the strength check trigger a localized toast instead of an HTTP 400 error.
* [ ] **Registration (Email Conflict):** Try to register with an already used email. Verify the toast specifically says: "This email address is already taken."
* [ ] **Registration (Username Conflict):** Try to register with an already used username. Verify the toast specifically says: "This username is already taken."
* [ ] **Console Check:** Open Developer Tools (F12). Verify that registration conflicts do not log red 409 error codes in the Console.
* [ ] **Login:** Log in with valid credentials. Verify you are redirected successfully to the Home/Dashboard.
* [ ] **OAuth Handshake:** Click the GitHub and 42 icons from a logged-out state. Verify you reach the actual provider login pages (e.g., github.com).
* [ ] **Logout:** Click logout. Verify that it clears your session and returns you to the landing page.

## 2. User Profile & Visuals
* [ ] **Avatar Upload & Persistence:** Go to Profile -> Edit and upload a new image. Verify it updates in the UI, persists after a page refresh, and immediately appears on the machine in the `apps/backend/uploads/` directory.
* [ ] **Data Display:** Verify your Email address is correctly visible in the profile summary.
* [ ] **Bio Update:** Edit your bio and save. Verify the update is immediately reflected on your public profile.
* [ ] **Leaderboard Rank:** Verify that the #... tag above your email correctly displays your global rank (e.g., #1).
* [ ] **Language Switcher (Complete Coverage):** Toggle between FR, EN, and NL. Verify that all standard UI text (buttons, cards, titles), "Conflict" toast messages, and the "Banned" page text translate immediately and accurately.

## 3. Social & Real-time Connectivity
* [ ] **Friend Search:** Use the search bar to find another user (e.g., the seeded admin account).
* [ ] **Friend Request:** Send a request. Using a second browser/incognito window for the recipient, verify the request appears in their notification/friend panel.
* [ ] **Presence (WebSocket):** Open two browsers logged in as different users. Log in/out in one window. Verify the other window sees the status indicator (green/grey dot) change from "Offline" to "Online" and vice versa instantly.
* [ ] **Real-time Chat:** Send cross-window messages between two logged-in users. Verify they appear in real-time without requiring a page refresh.

## 4. Game Experience (The Engine)
* [ ] **Game Selection:** Navigate to the "Games" tab and verify you can select different games.
* [ ] **Math Game Loop:** Launch the game. Verify the problem appears (e.g., "12 + 45"), enter an answer, and verify the feedback (Correct/Incorrect).
* [ ] **Reaction Time Loop:** Launch the game and verify the "Click when green" mechanic works accurately.
* [ ] **Result Visibility:** After answering in either game, verify the UI does not immediately switch to "Loading". Your result (e.g., "342ms" or "Correct!") must remain visible for exactly 5 seconds.
* [ ] **Fair Scoring:** Get a result under 500ms in Reaction Time. Verify you actively gain Aura points (Rating) and that the backend does not register a 0 score. Complete a session and verify your overall score updates on the Leaderboard.

## 5. Administrative Controls & Banning
* [ ] **Admin Access:** Ensure you are logged in as an admin and navigate to `/admin`. Verify the dashboard loads.
* [ ] **Admin Refresh Persistence:** Refresh the `/admin page`. Verify you remain on the admin page and are not erroneously redirected to the home page.
* [ ] **Tab Navigation:** Verify you can seamlessly switch between the "Users" and "Ranks" tabs within the admin panel.
* [ ] **User Management:** Verify the user list populates correctly.
* [ ] **Real-time Ban Mechanism:**
    1. Log in as Admin in Browser A and a Test User in Browser B.
    2. In Browser A, locate the Test User and click Ban.
    3. Verify that Browser B instantly redirects to the `/banned` page without the user refreshing.
* [ ] **Banned Message:** On the redirected page, verify the text strictly reads: "You have been banned." (and respects the active language setting).
* [ ] **Banned Logout:** Click the logout button on the `/banned` page. Attempt to navigate to protected routes and verify access is permanently blocked.

## 6. UX, Navigation & Responsiveness
* [ ] **Mobile Layout (General):** Use browser DevTools (Cmd+Shift+M) to simulate a mobile device (iPhone/Pixel). Verify the sidebar collapses into a hamburger menu or bottom bar, and that grid cards stack vertically.
* [ ] **Mobile Layout (Profile):** While still in mobile view, verify that the "Profile" card adapts and remains fully readable.
* [ ] **Navigation Guards:** Attempt to access the `/profile` URL directly while logged out. Verify the application intercepts the request and redirects you to the home page or login prompt.
