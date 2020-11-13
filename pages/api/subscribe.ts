import { NowRequest, NowResponse } from '@vercel/node'
import {  MongoClient, Db } from 'mongodb';
import url from 'url';

let cacheDb: Db = null;

async function connectToDabase(uri: string) {
    if (cacheDb) {
        return cacheDb;
    }
    const client = await MongoClient.connect(uri, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    const dbName = url.parse(uri).pathname.substr(1);

    const db = client.db(dbName);

    cacheDb = db;

    return db;
}


export default async (request:NowRequest, response:NowResponse) => {
    const { email } = request.body;

    const db = await connectToDabase(process.env.MONGODB_URI)

    const collection = db.collection('subscribers');

    await collection.insertOne({
        email, subscribeAt: new Date()
    })


    return response.json({ message:` Hello World ${email}!`})

}