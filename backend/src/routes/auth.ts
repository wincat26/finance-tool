import express from 'express';
import passport from 'passport';

const router = express.Router();

// Google 登入路由
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

// Google Callback 路由
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login?error=auth_failed',
        session: true,
    }),
    (req, res) => {
        // 登入成功，重導向回首頁或 Dashboard
        res.redirect('/');
    }
);

// 登出路由
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

// 取得當前使用者資訊
router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            isAuthenticated: true,
            user: req.user,
        });
    } else {
        res.json({
            isAuthenticated: false,
            user: null,
        });
    }
});

export default router;
