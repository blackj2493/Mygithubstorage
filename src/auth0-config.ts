export const auth0Config = {
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email',
  },
  baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
  clientID: process.env.AUTH0_CLIENT_ID || 'dummy-client-id',
  clientSecret: process.env.AUTH0_CLIENT_SECRET || 'dummy-client-secret',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://dummy.auth0.com',
  secret: process.env.AUTH0_SECRET || 'dummy-secret-key-for-development-only',
  routes: {
    callback: '/api/auth/callback',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
  },
};