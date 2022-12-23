import { urlSchema } from '../schemas/urlSchema.js';
import {connection} from '../database/database.js';

export async function verifyURL(req,res,next){
    let {url} = req.body;
    let {userId} = res.locals.user;
    let URL = {
        url:url
    };

    let validation = urlSchema.validate(URL,{abortEarly:false});

    if(validation.error){
        const erros = validation.error.details.map((detail) => detail.message);
        res.status(422).send(erros);
        return;
    }
    else if(!verificaURL(url)){
        res.status(422).send("Formato de URL não suṕortado");
    }
    else{
        let {rows} = await connection.query(`
            select * from urls
            where "userId" = $1
            and url = $2
        `,[userId,url]);

        if(rows.length > 0){
            res.status(200).send({
                shortUrl: rows[0].shortUrl
            });
        }
        else{
            next();
        }
    }
}

export async function verifyUrlForDelete(req,res,next){
    let {id} = req.params;
    let {userId} = res.locals.user;
    let {rows} = await connection.query(`
        select * from urls
        where "id" = $1
    `,[id]);

    if(rows.length === 0){
        res.status(404).send();
    }
    else if(userId !== rows[0].userId){
        res.status(401).send();
    }
    else{
        res.locals.urls = {
            id:rows[0].id
        }
        next();
    }
}

function verificaURL(url){
	var re = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?|magnet:\?xt=urn:btih:/
    
    if (re.test(url)) {
      return true;
    } else {
      return false;
    }
}

