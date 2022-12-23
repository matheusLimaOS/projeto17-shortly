import { nanoid } from "nanoid";
import {connection} from '../database/database.js';

export async function insertURL(req,res){
    let {userId} = res.locals.user;
    let {url} = req.body;
    try{
        let shortUrl = nanoid();

        let insert = await connection.query(`
            insert into urls("userId","url","shortUrl","visitCount")
            values($1,$2,$3,0)
        `,[userId,url,shortUrl]);

        res.status(201).send({shortUrl});
    }
    catch(e){
        console.log(e);
        res.status(500).send();
    }

}

export async function getURL(req,res){
    let {id} = req.params;
    try{
        let {rows} = await connection.query(`
            select "id","shortUrl","url" from urls
            where id = $1
        `,[id]);

        if(rows.length===0){
            res.status(404).send();
        }
        else{
            res.status(200).send(rows[0]);
        }
    }
    catch(e){
        console.log(e);
        res.status(500).send();
    }
}

export async function getUrlByShortURL(req,res){
    let {shortUrl} = req.params;
    try{
        let {rows} = await connection.query(`
            select "id","url","visitCount" from urls
            where "shortUrl" = $1
        `,[shortUrl]);
        if(rows.length===0){
            res.status(404).send();
        }
        else{
            let update = await connection.query(`
                update urls
                set "visitCount" = $1
                where id = $2
            `,[rows[0].visitCount+1,rows[0].id]);
            res.redirect(200,rows[0].url)
        }
    }
    catch(e){
        console.log(e);
        res.status(500).send();
    }
}

export async function deleteUrl(req,res){
    let {id} = res.locals.urls;
    try{
        let {rows} = await connection.query(`
            delete from urls
            where "id" = $1
        `,[id]);

        res.status(204).send();
    }
    catch(e){
        console.log(e);
        res.status(500).send();
    }
}

export async function allRoutesByUser(req,res){
    let {userId} = res.locals.user;
    try{
        let {rows} = await connection.query(`
            select res.* from (
                select u."id", u."name" ,SUM(shorts."visitCount")::int as visitCount,array_agg(to_json(shorts)) as "shortenedUrls" from(
                    select ur."id",ur."shortUrl",ur.url,ur."visitCount" from urls ur
                    where ur."userId" = $1
                ) shorts
                join users u on u.id = $1
                group by u.id
            ) res
            ;
        `,[userId]);

        res.status(200).send(rows);
    }
    catch(e){
        console.log(e);
        res.status(500).send();
    }
}

export async function ranking(req,res){
    try{
        let {rows} = await connection.query(`
            select u.id, u.name,count(urls.id) as "linksCount", sum(urls."visitCount") as "visitCount"  from users u
            left join urls on urls."userId" = u.id
            group by u.id
            order by "visitCount"
        `,[]);

        res.status(200).send(rows);
    }
    catch(e){
        console.log(e);
        res.status(500).send();
    }
}