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

        // 1. Professor: Dr. Sarah Williams
        if (
          credentials.email.toLowerCase() === 'prof.sarah@gapfinder.demo' &&
          credentials.password === 'Professor@123'
        ) {
          return {
            id: 'usr-prof-sarah',
            name: 'Dr. Sarah Williams',
            email: 'prof.sarah@gapfinder.demo',
            role: 'teacher'
          } as any;
        }

        // 2. Student: Alex Chen
        if (
          credentials.email.toLowerCase() === 'alex.chen@gapfinder.demo' &&
          credentials.password === 'Student@123'
        ) {
          return {
            id: 'usr-alex-chen',
            name: 'Alex Chen',
            email: 'alex.chen@gapfinder.demo',
            role: 'student'
          } as any;
        }

        // 3. Student: Priya Sharma
        if (
          credentials.email.toLowerCase() === 'priya.sharma@gapfinder.demo' &&
          credentials.password === 'Student@123'
        ) {
          return {
            id: 'usr-priya-sharma',
            name: 'Priya Sharma',
            email: 'priya.sharma@gapfinder.demo',
            role: 'student'
          } as any;
        }

        // 4. Demo Judge Account & General Student Account
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

        // General fallback
        const isProf = credentials.email.toLowerCase().includes('prof') || credentials.email.toLowerCase().includes('teacher');
        return {
          id: `usr-${Date.now()}`,
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: isProf ? 'teacher' : 'student'
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
