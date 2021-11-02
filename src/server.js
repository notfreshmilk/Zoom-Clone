import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket["nickname"]  = "Anon";
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });

    socket.on("enter_room", (roomName, done) => {
        console.log(roomName);
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket["nickname"]); // "welcome"을 방안에 있는 모두에게 보냄
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket["nickname"]));
    });

    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket["nickname"]}: ${msg}`);
        done(); // 백엔드에서 실행하는 것이 아닌, done(); 호출했을 때 프론트엔드에서 코드를 실행할거임.
    });
    
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));

});


const handleListen = () => console.log(`Listening on http://localhost:5000`);
httpServer.listen(5000, handleListen);