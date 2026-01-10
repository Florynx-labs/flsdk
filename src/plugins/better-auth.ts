/**
 * Better Auth Plugin for FarmLink
 */

export interface FarmlinkProviderOptions {
    clientId: string;
    clientSecret: string;
    baseUrl?: string;
}

/**
 * Creates a Farmlink OAuth provider for Better Auth
 */
export const farmlinkProvider = (options: FarmlinkProviderOptions) => {
    const baseUrl = options.baseUrl || "https://farmlinkmali.com";

    return {
        id: "farmlink",
        name: "FarmLink",
        type: "oauth2",
        issuer: baseUrl,
        authorization: {
            url: `${baseUrl}/oauth/authorize`,
            params: { scope: "openid profile email" }
        },
        token: {
            url: `${baseUrl}/api/v1/oauth/token`,
        },
        userinfo: {
            url: `${baseUrl}/api/v1/me`,
        },
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        /**
         * Maps the Farmlink profile to Better Auth user profile
         */
        profile(profile: any) {
            return {
                id: profile.id || profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.avatar || profile.picture || profile.image,
            };
        },
    };
};
