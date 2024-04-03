const express=require('express');
const path=require('path');
const cors=require('cors');
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const app=express();
const port=9000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const {MongoClient}=require('mongodb');
// const uri="mongodb://127.0.0.1:27017";   
const uri = "mongodb+srv://kalpesh0000:TWrzbSjt0kojc4DM@cluster0.ez87kpx.mongodb.net/";
const client=new MongoClient(uri);
const dbName="certificate";
const db=client.db(dbName);
client.connect().then((res)=>{
    console.log("Connected")
    const collection=db.collection('Users');
    app.get('/api/data/',(req,res)=>{
        collection.find({}).toArray().then((documents)=>{                   
            res.json(documents);
        });
    });    
}).catch(err => console.log(err));
app.post('/login', (req, res) => {
	let inputData = req.body;
	console.log(inputData);
	if (!inputData.username || !inputData.password) {
		return res.status(401).json({ message: 'Fill all fields' });
	}
	client.connect().then(() => {
        const collection1 = db.collection('login');
        collection1.findOne({ username: inputData.username, password: inputData.password })
            .then((user) => {
                if (!user) {
                    return res.status(401).json({ message: 'Invalid username or password' });
                }
                var token = jwt.sign({ name:inputData.username }, 'MMEAC@22');
                console.log(token);
                res.json({ token: token });
            })
            .catch((error) => {
                console.error("Error finding user:", error);
                res.status(500).send('Internal Server Error');
            })
            .finally(() => {
               
            });
    })
});
app.use(express.json());
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
