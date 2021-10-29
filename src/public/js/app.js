const messageForm = document.querySelector('#message');
const messageList = document.querySelector('ul');
const nickForm = document.querySelector("#nick");
const frontSocket = new WebSocket(`ws://${window.location.host}`); // frontSocket = 서버로의 연결을 뜻함


function makeMessage(type, payload){
    const msg = {type, payload};
    return JSON.stringify(msg); // stringify 하면 아예 server로 send되지 않음.
}


frontSocket.addEventListener("open", () => {
    console.log("Connected to Server");
})


frontSocket.addEventListener("message", (messageFromServer) => { // backend에서 온 메세지 출력
    const li = document.createElement("li");
    li.innerText = messageFromServer.data;
    messageList.append(li);

})

frontSocket.addEventListener("close", () => {
    console.log("Disconnected to Server");
})

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector('input');
    frontSocket.send(makeMessage("new_message", input.value));
    const li = document.createElement("li");
    li.innerText = `You : ${input.value}`;
    messageList.append(li);    
    input.value = '';
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector('input');
    frontSocket.send(makeMessage("nickname", input.value));
    input.value = '';
}


messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);

// 매번 새로운 브라우저가 backend로 연결할 때, 이 코드는 backend와 연결된 각 브라우저에 대해 작동함
// setTimeout(() => {
//     frontSocket.send("hello from the browser");
// }, 1000);