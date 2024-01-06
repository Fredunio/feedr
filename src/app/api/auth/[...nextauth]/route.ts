import bcrypt from "bcrypt";
import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import mongoClientPromise from "@/app/lib/clients/mongoClient";
import { User } from "@/app/models/User";
import { connectMongoose } from "@/app/lib/clients/connectMongoose";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Invalid/Missing environment variable: "NEXTAUTH_SECET"');
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('Invalid/Missing environment variable: "GOOGLE_CLIENT_ID"');
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    'Invalid/Missing environment variable: "GOOGLE_CLIENT_SECRET"'
  );
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECET,
  debug: process.env.NODE_ENV === "development",
  adapter: MongoDBAdapter(mongoClientPromise),

  // callbacks: {
  //   async jwt({ account, token, user, profile, session, trigger }) {
  //     return {
  //       ...token,
  //       name: user.name,
  //     };
  //   },
  // },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "test@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        const email = credentials?.email;
        const password = credentials?.password;

        connectMongoose();

        let user;
        try {
          user = await User.findOne({ email });
        } catch (error) {
          return null;
        }
        const passwordOk = user && bcrypt.compareSync(password, user.password);

        if (passwordOk) {
          return user;
        }
        return null;
      },
    }),
  ],
};

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return false;
  }
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return false;
  }
  return user.admin;
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
