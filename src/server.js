import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views'); //__dirname은 현재 실행하는 파일의 절대경로이다.
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));

//console.log('__dirname : ', __dirname);
const handleListen = () => console.log(`Listening on http://localhost:5000`);

// 같은 서버에 http, webSocket 모두 작동 시키기 (선택사항)
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


const sockets = [];

wss.on("connection", (backSocket) => {
    sockets.push(backSocket); // 각 브라우저에 연결될 때마다 이 array를 넣어줌.
    backSocket["nickname"] = "Anon"

    console.log("Connected to Browser"); // socket = 연결된 브라우저
    backSocket.on("close",() => {console.log("Disconnected to Browser");})
    backSocket.on("message", (messageFromFront) => {
        const message = JSON.parse(messageFromFront);
        switch(message.type){
            case "new_message" : 
                sockets.forEach((aSocket) => 
                    //aSocket.send(message.payload.toString())
                    aSocket.send(`${backSocket.nickname}: ${message.payload}`)
                    // nickname의 속성을 socket object에 저장하고 있음.
                );
                break;
            case "nickname" : 
                backSocket["nickname"] = message.payload;
                //console.log(message.payload);
                console.log(sockets)
                break;
        }   
        
        //sockets.forEach((aSocket) => aSocket.send(messageFromFront.toString()));
        //console.log(typeof(parsed), typeof(messageFromFront));
        //console.log('message From -> '+ typeof(messageFromFront));
    })
});




server.listen(5000, handleListen);
