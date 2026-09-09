// This is the only place in the entire project where process.env is read.
// All other files require from here — never from process.env directly.

module.exports = {
port: process.env.PORT || 3000,
nodeEnv: process.env.NODE_ENV,
jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
dbUrl: process.env.DATABASE_URL,
maxArticles: parseInt(process.env.MAX_ARTICLES) || 50,
};