console.log("hello world :o");

const banana = document.getElementById("banana");
const messageBox = document.getElementById("messagebox");

const wsUrl = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/websocket`;

const ws = new WebSocket(wsUrl);

ws.onopen = () => {
    console.log('Connection Opened');

    setInterval(() => {
        ws.send('PING');
    }, 3000);
}

ws.onmessage = (evt) => {
    try {
        const payload = JSON.parse(evt.data);

        if (payload.action == "dance") {
            banana.style.display = 'block';
            messageBox.innerHTML = `<h1>Hey ${payload.sender}</h1>`;
    
            setTimeout(() => {
                banana.style.display = 'none';
                messageBox.innerHTML = '';
            }, 3000);
        }
    } catch {
        
    }
}
