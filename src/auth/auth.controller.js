import User from '../users/user.model.js';
import Admin from '../admins/admin.model.js';
import { hash, verify } from 'argon2';
import { generateJWT } from '../helpers/generate-jwt.js';

export const authenticate = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const emailLower = email ? email.toLowerCase() : '';
        const usernameLower = username ? username.toLowerCase() : '';

        let account = await User.findOne({ $or: [{ email: emailLower }, { username: usernameLower }] });

        if (account) {
            if (!account.estado) {
                return res.status(400).json({ msg: "User account is inactive!" });
            }

            const isPasswordValid = await verify(account.password, password);
            if (!isPasswordValid) {
                return res.status(400).json({ msg: "Invalid password!" });
            }

            const token = await generateJWT(account.id);

            return res.status(200).json({
                msg: "User successfully authenticated!",
                userDetails: {
                    uid: account.id,
                    fullName: account.name,
                    username: account.username,
                    email: account.email,
                    phone: account.phone,
                    role: account.role,
                    isAdmin: false,
                    token
                }
            });
        }

        account = await Admin.findOne({ $or: [{ email: emailLower }, { username: usernameLower }] });

        if (account) {
            if (!account.estado) {
                return res.status(400).json({ msg: "Admin account is inactive!" });
            }

            const isPasswordValid = await verify(account.password, password);
            if (!isPasswordValid) {
                return res.status(400).json({ msg: "Invalid password!" });
            }

            const token = await generateJWT(account.id);

            return res.status(200).json({
                msg: "Admin successfully authenticated!",
                adminDetails: {
                    uid: account.id,
                    fullName: account.name,
                    username: account.username,
                    email: account.email,
                    phone: account.phone,
                    role: account.role,
                    isAdmin: true,
                    token
                }
            });
        }

        return res.status(400).json({ msg: "Invalid credentials - email or username not found!" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error!",
            error: error.message
        });
    }
};

export const createUser = async (req, res) => {
    try {
        const userData = req.body;

        const hashedPassword = await hash(userData.password);

        const newUser = await User.create({
            name: userData.name,
            surname: userData.surname,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            password: hashedPassword,
            role: userData.role,
        });

        return res.status(201).json({
            message: "User successfully registered!",
            userDetails: {
                email: newUser.email
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to register user!",
            error: error.message
        });
    }
};
