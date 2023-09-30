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

    async handleGetAllUsers(req, res) {
        let id = req.body.id;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters',
                users: [],
            });
        }

        let users = await userService.getAllUsers(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: 'OK',
            users,
        });
    }
}

module.exports = new userController();
