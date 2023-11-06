import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { CandleStickData} from './Recoil/Recoil'
import Kline from "./Component/klIne";

const App = () => {
    
    const [candelstickstate, setCandleStickDataState] = useRecoilState(CandleStickData)



    // async function fetchData(){
    //     const res = await fetch("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1w");
    //     const data = await res.json();
        
    //     console.log(data.length);

    //     setCandleStickDataState((prev:Stick[])=>{
    //         const newPrev: Stick[] = []
    //         for(let i=0; i<data.length; i++){
                
    //             newPrev.push({
    //             open: parseFloat(data[i][1]),
    //             close: parseFloat(data[i][4]),
    //             high: parseFloat(data[i][2]),
    //             low: parseFloat(data[i][3]),
    //             time: data[i][0]
    //            }) 

    //         }

    //         return [...prev, ...newPrev];
    //     })

    // }




    
    
    
    
    
    useEffect(()=>{
        // Custom Websocket server, sending random value of open,high,low,close, time(current time) of a stock
        const socket = new WebSocket("ws://127.0.0.1:9999?user=ayush");
        
        socket.onopen = () => {

            if (socket.readyState === 0) {
                console.log("Still connecting");

            } else if (socket.readyState === 1) {
                console.log('WebSocket connection established successfully!', socket.readyState);
                socket.send(JSON.stringify("Send Candlestick data"))
            } else if (socket.readyState === 3) {

                
                console.log("Connection closed", socket);

            } else {
                console.log("in process of closing");
            }

        };
        
        socket.onmessage = (message:MessageEvent)=>{
            const newDataa = JSON.parse(message.data).newData
            // console.log(newDataa);
            setCandleStickDataState((prev)=>{
                const newPrev = [...prev];
                    newPrev.push({
                        open: newDataa.open,
                        close: newDataa.close,
                        high: newDataa.high,
                        low: newDataa.low,
                        time: newDataa.time
                    })
                
                return [...newPrev];
            })
        }
    }, [])




    // Short polling binance server
    // useEffect(() => {
    //   
    //     const pollingInterval = setInterval(async () => {
    //       await fetchData();
    //     }, 5000);
    
    //     
    //     return () => clearInterval(pollingInterval);
    //   }, []);


    



    return (
        <div className="py-[5rem] gap-[12rem] min-h-[100vh] w-[100vw] bg-black flex justify-center items-center justify-center">
            <Kline candlestickData={candelstickstate}  />
        </div>
    );
}

export default App;