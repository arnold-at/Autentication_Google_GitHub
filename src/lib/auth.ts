import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmail, updateUser } from "@/lib/users";

const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña requeridos");
        }
        const user = findUserByEmail(credentials.email);
        if (!user) throw new Error("Credenciales incorrectas");

        if (user.lockedUntil && Date.now() < user.lockedUntil) {
          const minutesLeft = Math.ceil((user.lockedUntil - Date.now()) / 60000);
          throw new Error(`Cuenta bloqueada. Intenta en ${minutesLeft} minuto(s)`);
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          const newAttempts = user.loginAttempts + 1;
          if (newAttempts >= MAX_ATTEMPTS) {
            updateUser(credentials.email, {
              loginAttempts: newAttempts,
              lockedUntil: Date.now() + LOCK_TIME_MS,
            });
            throw new Error("Demasiados intentos. Cuenta bloqueada por 15 minutos");
          }
          updateUser(credentials.email, { loginAttempts: newAttempts });
          throw new Error(`Contraseña incorrecta. Intentos restantes: ${MAX_ATTEMPTS - newAttempts}`);
        }

        updateUser(credentials.email, { loginAttempts: 0, lockedUntil: null });
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: { signIn: "/signIn" },
  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET,
};