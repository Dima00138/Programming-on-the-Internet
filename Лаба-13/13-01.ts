import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';

const app = express();

app.use(session({
 secret: 'secret',
 resave: false,
 saveUninitialized: false,
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: '630117701678-l00vs2sftdbrn01mf44dbafo1rl7uort.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback'
 },
 function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
 }
));

passport.serializeUser((user, done) => {
 done(null, user);
});

passport.deserializeUser((user : any, done) => {
 done(null, user);
});

app.get('/login', (req, res) => {
 res.send('<a href="/auth/google">Login with Google</a>');
});

app.get('/auth/google',
 passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
 passport.authenticate('google', { failureRedirect: '/login' }),
 function(req, res) {
    res.redirect('/resource');
 });

app.get('/logout', (req, res) => {
 req.logout(() => {});
 res.redirect('/login');
});

app.get('/resource', (req, res) => {
 if (req.isAuthenticated()) {
    res.send(`RESOURCE\nUser: ${(req.user as any).displayName}`);
 } else {
    res.redirect('/login');
 }
});

app.get('*', (req, res) => {
 res.status(404).send('Not Found');
});

app.listen(3000, () => { console.log(`Сервер запущен на порту 3000`); });