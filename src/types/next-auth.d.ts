import NextAuth, { DefaultSession, DefaultUser, JWT as DefaultJWT } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      image?: string | null
    } & DefaultSession["user"]
    accessToken?: string
  }

  interface User extends DefaultUser {
    id: string
    image?: string | null
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string
    picture?: string | null
    accessToken?: string
  }
}
