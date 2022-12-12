const User = require("../model/index.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    get: async(req, res) => {
        const users = await User.find();

        try {
            res.status(200).json(users);
        } catch(err) {
            res.status(400).json({findError: "Não foi possível encontrar usuários por motivos internos."});
        }
    },
    post: async(req, res) => {
        const { name, email, password, confirmpassword } = req.body;

        if(!name) {
            return res.status(422).json({MessageError: "O nome é obrigatório!"});
        }
        if(!email) {
            return res.status(422).json({MessageError: "O email é obrigatório!"});
        }
        if(!password) {
            return res.status(422).json({MessageError: "A senha é obrigatória!"});
        }
        if(!confirmpassword) {
            return res.status(422).json({MessageError: "A confirmação de senha é obrigatória!"});
        }
        if(password !== confirmpassword) {
            return res.status(422).json({MessageError: "As senhas não coincidem!"});
        }

        const userExists = await User.findOne({email: email});

        if(userExists) {
            return res.status(422).json({MessageError: "Este email já está cadastrado!"});
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: passwordHash
        });

        try {
            await user.save();

            res.status(201).json({Message: "O usuário foi criado com sucesso!"});
        } catch(err) {
            res.status(500).json({Message: "Não foi possível criar o usuário por motivos internos."});
        }
    },
    // eslint-disable-next-line no-unused-vars
    checkTokenMiddleware: (req, res, next) => {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if(!token) {
            return res.status(401).json({Message: "Acesso negado!"});
        }

        try {
            const secret = process.env.SECRET;

            jwt.verify(token, secret);

            next();
        } catch(err) {
            res.status(400).json({Message: "Token inválido!"});
        }
    },
    privateRoute: async(req, res) => {
        const id = req.params.id;
        const user = await User.findById(id, "-password");

        if(!user) {
            return res.status(404).json({Message: "Usuário não encontrado!"});
        }

        res.status(200).json(user);
    },
    user: async(req, res) => {
        const {email, password} = req.body;

        if(!email) {
            return res.status(422).json({MessageError: "O email é obrigatório!"});
        }
        if(!password) {
            return res.status(422).json({MessageError: "A senha é obrigatória!"});
        }

        const user = await User.findOne({email: email});

        if(!user) {
            return res.status(422).json({MessageError: "Usuário não encontrado!"});
        }

        const comparePass = await bcrypt.compare(password, user.password);

        if(!comparePass) {
            return res.status(404).json({MessageError: "Senha incorreta!"});
        }

        try {
            const secret = process.env.SECRET;
            const token = jwt.sign({
                id: user._id
            }, secret);

            res.status(200).json({Message: "Autenticação realizada!", token});

        } catch(err) {
            res.status(500).json({Message: "Aconteceu um erro interno do servidor, tente mais tarde!."});
        }
    }
};
