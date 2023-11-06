const http  = require('http');
const {server} = require('websocket')
const {getRandomClose, getRandomHigh, getRandomLow, getRandomOpen} = require('./controller/ws_controller')
let intervalid;
const httpServer = http.createServer((req, res) => {
    console.log("Server started");
})

const websocket = new server({
    "httpServer": httpServer
})

var connectionsToUser = new Map();
var UserToConnection = new Map();


websocket.on("request", (request) => {

    console.log("New Request");
    let connections= request.accept(null, request.origin);
    console.log(request.resourceURL.query);
    connectionsToUser.set(connections, request.resourceURL.query.user)
    UserToConnection.set(request.resourceURL.query.user, connections)

    console.log("Active Connection ", UserToConnection.size);
    console.log("keys ", UserToConnection.keys());

    

    connections.on("message", (data) => {

        const parsedData=data.utf8Data;
        console.log(parsedData.data);

        sendData();
        
    })

    connections.on("close", (code, des)=>{

        console.log("Close event");
        var saveUser = connectionsToUser.get(connections);
        UserToConnection.delete(saveUser);
        connectionsToUser.delete(connections);
        console.log(code);
        console.log(des);
        console.log("\n\n");
        
    })

    
    

})

function sendData(){
    intervalid = setInterval(()=>{
        const date = new Date();
        console.log("he");
        const open = getRandomOpen();
        const close = getRandomClose();
        const high = getRandomHigh();
        const low = getRandomLow();
        
        const con = UserToConnection.get("ayush");
        if(con){ 
        con.send(JSON.stringify({
            query: "data",
            newData: {
                open: open,
                close: close,
                high: high,
                low: low,
                time: date.getTime()
            }
        }))
    } else{
        clearInterval(intervalid)
    }

    }, 2000)
}


httpServer.listen(9999, () => {
    console.log("http server started at 9999");
})