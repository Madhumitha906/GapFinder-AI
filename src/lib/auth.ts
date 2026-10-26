import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Judge & Student Demo Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'judge@gapfinder.ai' },
        password: { label: 'Password', type: 'password', placeholder: 'demo123456' }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // Demo Judge Account & General Student Account
        if (
          credentials.email === 'judge@gapfinder.ai' &&
          credentials.password === 'demo123456'
        ) {
          return {
            id: 'usr-judge-1',
            name: 'Hackathon Judge / Evaluator',
            email: 'judge@gapfinder.ai',
            role: 'evaluator'
          } as any;
        }

        // Allow any standard student demo login
        return {
          id: `usr-${Date.now()}`,
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: 'student'
        } as any;
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'student';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role || 'student';
      }
      return session;
    }
  },
  pages: {
    signIn: '/'
  },
  secret: process.env.NEXTAUTH_SECRET || 'gapfinder-super-secret-key-eval-2026'
};
