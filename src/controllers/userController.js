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
        let id = req.query.id;
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

    async handleCreateNewUser(req, res) {
        let message = await userService.createNewUser(req.body);
        console.log(message);
        res.status(200).json(message);
    }

    async handleEditUser(req, res) {
        let data = req.body;
        let message = await userService.updateUserData(data);
        res.status(200).json(message);
    }

    async handleDeleteUser(req, res) {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required paramesters !',
            });
        }
        let message = await userService.deleteUser(req.body.id);
        return res.status(200).json(message);
    }

    async getAllCode(req, res) {
        try {
            let data = await userService.getAllCodeService(req.query.type);
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server',
            });
        }
    }
}

module.exports = new userController();
