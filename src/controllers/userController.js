import userService from '../services/userService';

class userController {
    async handleLogin(req, res) {
        let email = req.body.email;
        let password = req.body.password;

        if (!email || !password) {
            res.status(500).json({
                errCode: 1,
                message: 'Missing input parameter!',
            });
        }
        let userData = await userService.handleUserLogin(email, password);
        res.status(200).json({
            errCode: userData.errCode,
            message: userData.errMessage,
            user: userData.user ? userData.user : {},
        });
    }
}

module.exports = new userController();
