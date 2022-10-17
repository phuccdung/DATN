const User = require('../model/User');
const bcrypt = require('bcrypt');
const CryptoJS=require("crypto-js");
const handleNewUser = async (req, res) => {
    const {name, user, pwd,img } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = CryptoJS.AES.encrypt(pwd,process.env.PASS_SEC).toString();

        //create and store the new user
        const result = await User.create({
            "name":name,
            "username": user,
            "password": hashedPwd,
            "img":img,
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };