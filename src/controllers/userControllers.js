import bcrypt from 'bcrypt';
import {connection} from '../database/database.js';
import { v4 as uuid } from 'uuid';

export async function SignUp(req,res){
    let {name,email,password} = res.locals.user;
    
    try{
        let {rows} = await connection.query(`
            insert into users("name","email","password")
            values($1,$2,$3)
        `,[name,email,bcrypt.hashSync(password,10)]);


        res.status(201);
    }
    catch(e){
        console.log(e)
        res.status(500);
    }
}
export async function SignIn(req,res){
    try{
        let {userId} = res.locals.user;
        let {email,password} = res.locals.user;
        let {rows} = await connection.query(`
            select * from users
            where email = $1
        `,[email]);
    
        if(bcrypt.compareSync(password,rows[0].password)){
            const token = uuid();
            let del = await connection.query(`
                delete from sessions
                where "userId" = $1
            `,[rows[0].id]);
            let insert = await connection.query(`
                insert into sessions("userId","token")
                values($1,$2)
            `,[rows[0].id,token]);
            res.status(200).send(token);
        }
        else{
            res.status(401).send("Senha incorreta");
        }
    }
    catch(e){
        console.log(e);
        res.status(500);
    }

}