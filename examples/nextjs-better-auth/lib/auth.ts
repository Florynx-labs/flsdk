import { betterAuth } from "better-auth";
import { farmlinkProvider } from "@farmlinkmali/sdk/plugins";

export const auth = betterAuth({
    plugins: [
        farmlinkProvider({
            clientId: process.env.FARMLINK_CLIENT_ID!,
            clientSecret: process.env.FARMLINK_CLIENT_SECRET!,
        })
    ]
});
