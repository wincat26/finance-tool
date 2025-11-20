import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from '../database/connection';

// 序列化使用者 ID 到 session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// 從 session 反序列化使用者
passport.deserializeUser(async (id: number, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      done(null, result.rows[0]);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error, null);
  }
});

// 設定 Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || `${process.env.BACKEND_URL}/api/auth/google/callback`,
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        const client = await pool.connect();
        try {
          // 檢查 Email 網域限制 (如果有的話)
          const email = profile.emails?.[0]?.value;
          const ALLOWED_DOMAIN = process.env.ALLOWED_DOMAIN; // e.g., 'yourcompany.com'

          if (ALLOWED_DOMAIN && email && !email.endsWith(`@${ALLOWED_DOMAIN}`)) {
            return done(null, false, { message: 'Unauthorized domain' });
          }

          // 檢查使用者是否存在
          const existingUser = await client.query(
            'SELECT * FROM users WHERE google_id = $1',
            [profile.id]
          );

          if (existingUser.rows.length > 0) {
            // 更新使用者資訊
            const user = existingUser.rows[0];
            await client.query(
              'UPDATE users SET name = $1, picture = $2, last_login_at = NOW() WHERE id = $3',
              [profile.displayName, profile.photos?.[0]?.value, user.id]
            );
            return done(null, user);
          } else {
            // 建立新使用者
            const newUser = await client.query(
              'INSERT INTO users (google_id, email, name, picture, last_login_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
              [
                profile.id,
                email,
                profile.displayName,
                profile.photos?.[0]?.value,
              ]
            );
            return done(null, newUser.rows[0]);
          }
        } catch (error) {
          return done(error as Error, undefined);
        } finally {
          client.release();
        }
      }
    )
  );
} else {
  console.warn('⚠️ Google Client ID/Secret not found. Google Auth will not work.');
}

export default passport;
