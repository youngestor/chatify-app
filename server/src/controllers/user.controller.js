const UserService = require('../services/user.service')

const userController = {
    handleRegister: async (req, res, next) => {
        await UserService.registerUser(req.body)
            .then(() => {
                res.json({ status: true, success: 'User Registered Successfully' })
            })
            .catch(next)
    },

    handleLogin: async (req, res, next) => {
        const { email, password } = req.body
        await UserService.checkEmail(email)
            .then(async (user) => {
                if (!user) {
                    throw new Error(`User don't exist`)
                }

                const isMatch = await user.comparePassword(password)
                if (isMatch === false) {
                    throw new Error(`Password invalid`)
                }

                let tokenData = { _id: user._id, fullName: user.fullName, email: user.email, image: user.image }
                const token = await UserService.generateToken(tokenData, 'secretKey', '1h')

                res.status(200).json({ status: true, token })
            })
            .catch(next)
    },
}

module.exports = userController
