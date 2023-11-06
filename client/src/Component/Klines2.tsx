import { createChart, IChartApi, DeepPartial, ISeriesApi, Time, CandlestickData, WhitespaceData, CandlestickSeriesOptions } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";

 type Stick = {
        open: number,
        high: number,
        low: number,
        close: number,
        time: Time
}

type wrapper = ISeriesApi<"Candlestick", Time, CandlestickData<Time> | WhitespaceData<Time>, CandlestickSeriesOptions, DeepPartial<CandlestickSeriesOptions>> | null

interface CandleStickProps {
    candlestickData: Stick[]; 
}

function Kline2({ candlestickData }: CandleStickProps) {

    const chartRef = useRef<HTMLDivElement | null>(null);
    const [chart, setChart] = useState<IChartApi | null>(null); 
    const [candlestickSeries, setCandlestickSeries] = useState<wrapper>(null);

    
    
    useEffect(() => {

        if (chart === null) {
            console.log("Creating Chart\n");

            setChart((prev:IChartApi|null)=>{
                console.log("Chart "+ typeof chart);
                const newPrev: IChartApi = createChart(chartRef.current as HTMLDivElement, {
                    layout: {
                        background: {  color: '#222' },
                        textColor: 'white'
                    },
                    grid: {
                        vertLines: {color:  "#444"},
                        horzLines: {color:  "#444"}
                    },
                    width: chartRef.current?.clientWidth ,
                    height: chartRef.current?.clientHeight || 500
                });
                // Chart return us an object which contain addCandlestickSeries function
                
                setCandlestickSeries((candlePrev:wrapper)=>{
                    console.log("Candlestickseries " + typeof candlestickSeries);
                    let newCandlePrev: wrapper = newPrev.addCandlestickSeries({
                            upColor: 'rgba(0,105,92,1.0)', //Color of that stick when market goes up
                            downColor: 'rgba(244,67,54,1.0)', //color of that stick when market goes down
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
        if (candlestickSeries && candlestickData.length > 0) {
            candlestickSeries.setData(candlestickData);
        }

        
    }, [candlestickData]);


    useEffect(()=>{
        console.log(chart + " " + chartRef + "\n");
    } ,[candlestickSeries, chart])

    return (
        <div className="h-[100%] w-[100%] flex flex-col items-center justify-center text-white">
            <div className="h-[80%] w-[70%]" ref={chartRef}></div>
            
        </div>
    );
}

export default Kline2;
