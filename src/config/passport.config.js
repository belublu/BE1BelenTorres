import passport from "passport";
import jwt from "passport-jwt"
import UserModel from "../dao/models/users.models.js";
import {createHash, isValidPassword} from "../util/hashbcrypt.js"

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const initializePassport = () => {


    const cookieExtractor = req => {
        let token = null
        if (req && req.cookies) {
            token = req.cookies["pepitaCookieToken"]
            return token
        }

    }

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "pepita"
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
}

export default initializePassport