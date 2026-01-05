import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Add subscription info to session
        const userData = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            subscriptionStatus: true,
            subscriptionTier: true,
            stripeCustomerId: true,
          },
        })

        if (userData) {
          session.user.subscriptionStatus = userData.subscriptionStatus
          session.user.subscriptionTier = userData.subscriptionTier
          session.user.stripeCustomerId = userData.stripeCustomerId
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      subscriptionStatus?: string | null
      subscriptionTier?: string | null
      stripeCustomerId?: string | null
    }
  }
}
