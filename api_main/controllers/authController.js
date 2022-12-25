const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CryptoJS=require("crypto-js");


const handleLogin = async (req, res) => {
    const cookies = req.cookies;

    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const hashedPassword=CryptoJS.AES.decrypt(
        foundUser.password,
        process.env.PASS_SEC);
    const OriginalPassword=hashedPassword.toString(CryptoJS.enc.Utf8);
    if (OriginalPassword==pwd) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        const newRefreshToken = jwt.sign(
            {  "username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '30d' }
        );

        // Changed to let keyword
        let newRefreshTokenArray =
            !cookies?.jwt
                ? foundUser.refreshToken
                : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

        if (cookies?.jwt) {

            /* 
            
            */
            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();

            // Detected refresh token reuse!
            if (!foundToken) {
                // clear out ALL previous refresh tokens
                newRefreshTokenArray = [];
            }

            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        }

        // Saving refreshToken with current user
        // foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 30*24*60 * 60 * 1000 });

        // Send authorization roles and access token to user
        res.json({ accessToken,"id":foundUser._id,"role":foundUser.roles,"name":foundUser.name,"username":foundUser.username,"img":foundUser.img });

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };