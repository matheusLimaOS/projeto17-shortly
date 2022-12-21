import {connection} from '../database/database.js';
import {signUpSchema,signInSchema} from "../schemas/userSchema.js";

export async function verifySignUp(req,res,next){
    let {name,email,password,confirmPassword} = req.body;
    let user = {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword
    };

    let validation = signUpSchema.validate(user,{abortEarly:false});

    if(validation.error){
        const erros = validation.error.details.map((detail) => detail.message);
        res.status(422).send(erros);
        return;
    }
    else{   
        if(user.password !==user.confirmPassword){
            res.status(422).send("Senha e confirmação de senha divergem!");
        }
        else{
            let {rows} = await connection.query(`
                select * from users
                where email = $1
            `,[user.email]);
            
            if(rows.length>0){
                res.status(409).send("E-mail já cadastrado");
            }
            else{
                res.locals.user = {
                    name: user.name,
                    email: user.email,
                    password: user.password
                }
                next();
            }
            
        }
    }
}
export async function verifySignIn(req,res,next){
    let {email,password} = req.body;
    let user = {
        email: email,
        password: password
    };

    let validation = signInSchema.validate(user,{abortEarly:false});

    if(validation.error){
        const erros = validation.error.details.map((detail) => detail.message);
        res.status(422).send(erros);
        return;
    }
    else{   
        let {rows} = await connection.query(`
            select * from users
            where email = $1
        `,[user.email]);

        if(rows.length > 0){
            res.locals.user = {
                email:user.email,
                password:user.password
            };
            next();
        }
        else{
            res.status(422).send("Email não encontrado!");
        }
    }
}

export async function verifyAuthentication(req,res,next){
    let {authorization} = req.headers;

    if(authorization===undefined){
        res.status(401).send();
    }
    else{
        let token = authorization.split(" ");

        let {rows} = await connection.query(`
            select * from sessions
            where token = $1
        `,[token[1]]);

        if(rows.length > 0){
            res.locals.user = {
                token: token,
                userId: rows[0].userId
            }
            next();
        }
        else{
            res.status(401).send("Token expirado");
        }

    }
}