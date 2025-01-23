import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import CreatePostPage from "./pages/CreatePostPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import UserPage from "./pages/UserProfilePage";
import HomePage from "./pages/HomePage"
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/create-post" element={<CreatePostPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/user/:userId" element={<UserPage />} />
            </Routes>
        </Router>
    );
}

export default App;
