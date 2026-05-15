import passport from "passport";

import {
    Strategy as GoogleStrategy,
} from "passport-google-oauth20";

import { User }
    from "../models/User";

import { sendEmail }
    from "../services/email.service";

if (
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
) {
    passport.use(
        new GoogleStrategy(
            {
                clientID:
                process.env.GOOGLE_CLIENT_ID,

                clientSecret:
                process.env.GOOGLE_CLIENT_SECRET,

                callbackURL:
                    process.env.GOOGLE_REDIRECT_URI ??
                    "https://fitbudget.onrender.com/api/auth/google/callback",
            },

            async (
                _accessToken,
                _refreshToken,
                profile,
                done
            ) => {
                try {
                    const googleId =
                        profile.id;

                    const email =
                        profile.emails?.[0]
                            ?.value;

                    const name =
                        profile.displayName;

                    let user =
                        await User.findOne(
                            {
                                googleId,
                            }
                        );

                    if (
                        !user &&
                        email
                    ) {
                        user =
                            await User.findOne(
                                {
                                    email,
                                }
                            );

                        if (user) {
                            user.googleId =
                                googleId;

                            await user.save();
                        } else {
                            user =
                                await User.create(
                                    {
                                        name,
                                        email,
                                        googleId,
                                        role:
                                            "USER",
                                    }
                                );

                            await sendEmail(
                                email,
                                "welcome",
                                {
                                    userName:
                                    name,
                                }
                            );
                        }
                    }

                    return done(
                        null,
                        user ?? false
                    );
                } catch (error) {
                    return done(
                        error as Error,
                        undefined
                    );
                }
            }
        )
    );
} else {
    console.warn(
        " Google OAuth no configurado"
    );
}

export default passport;