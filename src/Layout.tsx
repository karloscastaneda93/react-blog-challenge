import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import './Layout.css';

const Layout: React.FC = () => {
    return (
        <>
            <Header />
            <main className="main">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/post/:id" element={<PostDetailPage />} />
                </Routes>
            </main>
        </>
    );
};

export default Layout;
