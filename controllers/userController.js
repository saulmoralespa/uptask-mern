import User from "../models/User.js";
import generateId from "../helpers/generateid.js";
import generateJWT from "../helpers/generateJWT.js";
import { emailRegister, emailLostPassword } from "../helpers/email.js";

const register = async (req, res) => {
    
    const { email } = req.body;
    const existUser = await User.findOne({ email });

    if(existUser){
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({msg: error.message});
    }

    try{
        const user = new User(req.body);
        user.token = generateId();
        await user.save();
        emailRegister({
            email: user.email,
            name: user.name,
            token: user.token
        });
        res.json({msg: 'Usuario creado correctamente, Revisa tu Email para confirmar tu cuenta'});
    }catch(err){
        console.log(`Error: ${err.message}`);
    }
    
};

const auth = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if(!user){
        const error = new Error("El usuario no existe");
        return res.status(400).json({msg: error.message});
    }

    if(!user.confirmed){
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({msg: error.message});
    }

    if(await user.checkPassword(password)){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT(user._id)
        });
    }else{
        const error = new Error("El password es incorrecto");
        return res.status(403).json({msg: error.message});
    }
};

const confirm = async (req, res) => {
   const { token } = req.params;
   const userConfirm = await User.findOne({token});

   if(!userConfirm){
    const error = new Error("Token no válido");
    return res.status(403).json({msg: error.message});
   }

   try{
    userConfirm.confirmed = true;
    userConfirm.token = "";
    await userConfirm.save();
    res.json({msg: 'Usuario confirmado correctamente'});
   }catch(error){
    console.log(error);
   }
};

const lostPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user){
        const error = new Error("El usuario no existe");
        return res.status(400).json({msg: error.message});
    }

    try{
     user.token = generateId();
     await user.save();
     emailLostPassword(
        {
            email: user.email,
            name: user.name,
            token: user.token
        }
     );
     res.json({msg: 'Hemos enviado un email con las instrucciones'});

    }catch(error){
     console.log(error);   
    }
};

const lostPasswordToken = async (req, res) => {
   const { token } = req.params;
   
   const tokenValid = await User.findOne({ token });

   if(tokenValid){
    res.json({msg: "Token válido y el usuario existe"});
   }else{
    const error = new Error("Token No válido");
    return res.status(400).json({msg: error.message});
   }
};

const newPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({token});

    if(user){
        user.password = password;
        user.token = "";
        await user.save();
        res.json({msg: "Password modificado correctamente"});
    }else{
        const error = new Error("Token No válido");
        return res.status(400).json({msg: error.message});
    }
};

const profile = async (req, res) => {
    const { user } = req;

    res.json(user);
}

export { 
    register, 
    auth, 
    confirm, 
    lostPassword, 
    lostPasswordToken, 
    newPassword,
    profile
};