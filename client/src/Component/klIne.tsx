import { createChart, IChartApi, DeepPartial, ISeriesApi, Time, CandlestickData, WhitespaceData, CandlestickSeriesOptions } from "lightweight-charts";
import React, {  useEffect, useRef, useState } from "react";
import { CandleStickData, duration,  } from "../Recoil/Recoil";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

 type Stick = {
        open: number,
        high: number,
        low: number,
        close: number,
        time: Time
}

type wrapper = ISeriesApi<"Candlestick", Time, CandlestickData<Time> | WhitespaceData<Time>, CandlestickSeriesOptions, 
DeepPartial<CandlestickSeriesOptions>> | null



function Kline() {

    const [menu, showmenu] = useState<boolean>(false);
    const [rangeType, setRangeType] = useState<string>("");
    const durationVAL = useRecoilValue(duration)
    const setDuration = useSetRecoilState(duration)


    const chartRef = useRef<HTMLDivElement | null>(null);
    const [chart, setChart] = useState<IChartApi | null>(null); 
    const [candlestickSeries, setCandlestickSeries] = useState<wrapper>(null);
    const [candelstickstate, setCandleStickDataState] = useRecoilState(CandleStickData);
    const dTimer = useRef<NodeJS.Timer>()


    
    async function fetchData() {
        let dur = ''
        if( durationVAL.interval  === "sec"){
            console.log("Sec DUR\n");
            dur = 's'
        } else if( durationVAL.interval  === "min" ){
            console.log("MIN DUR\n");
            dur = 'm'
        } else if ( durationVAL.interval  === "hour"){
            console.log("HOUR DUR\n");
            dur ='h'
        } else if( durationVAL.interval  === "day"){
            console.log("Day DUR\n");
            dur = 'd'
        } else if( durationVAL.interval  === "week" ){
            console.log("Week Dur\n");
            dur='w'
        }
        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${durationVAL.range}${dur}`);
        const data = await res.json();

        

        setCandleStickDataState((prev: Stick[]) => {
            
            const newPrev: Stick[] = []
            
            if(prev.length===0){
                for(let i=0; i<data.length; i++){
                    newPrev.push({
                        open: parseFloat(data[i][1]),
                        close: parseFloat(data[i][4]),
                        high: parseFloat(data[i][2]),
                        low: parseFloat(data[i][3]),
                        time: data[i][0]
                    })
                }
                return [...newPrev];
            }

            let  newdata_ptr = data.length-1;
            
            for(let i=newdata_ptr; i>=0; i--){
                let time = data[i][0];
                if(time!==prev[prev.length-1].time){
                    newPrev.unshift({
                    open: parseFloat(data[i][1]),
                    close: parseFloat(data[i][4]),
                    high: parseFloat(data[i][2]),
                    low: parseFloat(data[i][3]),
                    time: data[i][0]
                })
                } else{
                    break;
                }
            }


            return [...prev, ...newPrev];
        })

        if(durationVAL.interval!=='sec'){
            console.log("Clear interval api call \n " + dTimer.current + rangeType);
            clearInterval((dTimer.current))
        }

    }


    useEffect(() => {
        
        
            dTimer.current = setInterval(async () => {
                await fetchData();
            }, 5000);
            
        

    }, [durationVAL]);


    
    
    useEffect(() => {
        // console.log("CandlestickState " + candelstickstate.length);
        if (chart === null) {
            // console.log("Creating Chart\n");

            setChart((prev:IChartApi|null)=>{
                // console.log("Chart "+ typeof chart);
                const newPrev: IChartApi = createChart(chartRef.current as HTMLDivElement, {
                    layout: {
                        background: {  color: '#222' },
                        textColor: 'white',
                        fontSize: 15,
                        fontFamily: 'sans serif'
                    },
                    grid: {
                        vertLines: {color:  "#444"},
                        horzLines: {color:  "#444"},
                    },
                    width: chartRef.current?.clientWidth ,
                    height: chartRef.current?.clientHeight || 300,
                });
                
                // Chart return us an object which contain addCandlestickSeries function
                setCandlestickSeries((candlePrev:wrapper)=>{
                    // console.log("Candlestickseries " + typeof candlestickSeries);
                    let newCandlePrev: wrapper = newPrev.addCandlestickSeries({
                            upColor: 'rgb(54,116,217)', //Color of that stick when market goes up
                            downColor: 'rgb(225,50,85)', //color of that stick when market goes down
                            borderVisible: false,
                            wickUpColor: 'red',
                            wickDownColor:'green'
                        });
                    return newCandlePrev;
                })

                
                return newPrev;
            })
            
        }

        // CandlestickSeries return us an object, which contain setData method
        if (candlestickSeries && candelstickstate.length > 0) {
            candlestickSeries.setData(candelstickstate);
        } 
        if(candlestickSeries && candelstickstate.length==0){
            candlestickSeries.setData(candelstickstate)
        }

        
    }, [candelstickstate]);


    function Help(event: React.MouseEvent<HTMLDivElement>){
        const target = event.target as HTMLDivElement;
        setRangeType(target.id);
        showmenu(false);
        setCandleStickDataState([]);
        setDuration((prev) => ({
            interval: target.id,
            range: rangeType==='min' ? 5 : 1,
            
        }));
        clearInterval(dTimer.current as NodeJS.Timer);

    }




    return (
        <div className="h-[100%] w-[100%] flex flex-col gap-[8rem] overflow-scroll pb-[2rem] pt-[0.5rem] justify-center items-center text-white">
            <div className="relative min-w-[100%] h-[10%] flex items-center justify-center">
                
                <div className=" absolute border-[1px] border-solid border-white border-opacity-50 h-[3rem] w-[8rem]
                flex justify-center items-center rounded-xl hover:cursor-pointer select-none hover:text-green-600"
                onClick={()=>{
                    showmenu((prev)=>{
                    return !prev;
                    })
                    
                    setRangeType("");

                }}>select range</div>
                
                {
                menu &&         
                <div className=" h-[10rem] flex flex-col w-[10rem] absolute border-[1px] border-solid border-white border-opacity-50 top-[4rem] rounded-xl">
                    <div onClick={Help} id="sec" className="w-[100%] text-[1.2rem] h-[20%] hover:text-green-400 hover:cursor-pointer flex items-center justify-center">sec</div>
                    <div onClick={Help} id="min" className="w-[100%] text-[1.2rem] h-[20%] hover:text-green-400 hover:cursor-pointer flex items-center justify-center">min</div>
                    <div onClick={Help} id="hour" className="w-[100%] text-[1.2rem] h-[20%] hover:text-green-400 hover:cursor-pointer flex items-center justify-center">hour</div>
                    <div onClick={Help} id="day" className="w-[100%] text-[1.2rem] h-[20%] hover:text-green-400 hover:cursor-pointer flex items-center justify-center">day</div>
                    <div onClick={Help} id="week" className="w-[100%] text-[1.2rem] h-[20%] hover:text-green-400 hover:cursor-pointer flex items-center justify-center">week</div>
                </div>
                }


            </div>
            <div className="h-[80%] w-[70%] scale-75" ref={chartRef}></div>
            
        </div>
    );
}

export default Kline;
