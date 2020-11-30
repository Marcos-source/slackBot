const cookieSession = require('cookie-session');
const passport = require('passport');
const { Strategy } = require('passport-github2');

const externalAccounts = require('../modules/profiles/externalAccounts/entity');

function authSetUp(server) {
  const githubStrategy = new Strategy(
    {
      clientID: `${process.env.GITHUB_CLIENT_ID}`,
      clientSecret: `${process.env.GITHUB_CLIENT_SECRET}`,
      callbackURL: `${process.env.URI_BACKEND}/login/github/callback`,
    },
    async (accessToken, refreshToken, user, cb) => {
      // TODO: ignoring refreshToken for now
      try {
        const username = await externalAccounts.getByUsername(user.username);
        if (!username) {
          const external = await externalAccounts.create({
            username: user.username,
            service_name: user.provider,
            token: accessToken,
          });
          const newExternalAccount = await externalAccounts.getById(external.id);
          return cb(null, newExternalAccount);
        }
        return cb(null, username);
      } catch (error) {
        return cb(error);
      }
    },
  );

  passport.use(githubStrategy);

  passport.serializeUser((user, cb) => {
    cb(null, user.username);
  });

  passport.deserializeUser((username, cb) => {
    externalAccounts.getByUsername(username)
      .then((user) => {
        cb(null, user);
      })
      .catch((err) => cb(err));
  });

  server.use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000,
      keys: ['supersecrettops3cr3t'],
    }),
  );

  server.use(passport.initialize());
  server.use(passport.session());
}

module.exports = authSetUp;
