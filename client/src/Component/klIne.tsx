// Ignore this


import { createChart, IChartApi, DeepPartial, ISeriesApi, Time, CandlestickData, WhitespaceData, CandlestickSeriesOptions } from "lightweight-charts";
import React, { useEffect, useRef } from "react";

 type Stick = {
        open: number,
        high: number,
        low: number,
        close: number,
        time: Time
}

interface CandleStickProps {
    candlestickData: Stick[]; 
}

function Kline({ candlestickData }: CandleStickProps) {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const chart = useRef<IChartApi | null>(null);
    const candlestickSeries = useRef<ISeriesApi<"Candlestick", Time, CandlestickData<Time> | WhitespaceData<Time>, CandlestickSeriesOptions, DeepPartial<CandlestickSeriesOptions>> | null>(null);

    function Print(){
        console.log("chartRef "+chartRef.current?.ATTRIBUTE_NODE+"\n");
        console.log("chart "+chart.current+"\n");
        console.log("candlestickSeries "+candlestickSeries.current+"\n");
    }
    
    useEffect(() => {

        if (chart.current === null) {
            console.log("Creating Chart\n");
            chart.current = createChart(chartRef.current as HTMLDivElement, {
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

            candlestickSeries.current = chart.current.addCandlestickSeries({
                upColor: 'rgba(0,105,92,1.0)', //Color of that stick when market goes up
                downColor: 'rgba(244,67,54,1.0)', //color of that stick when market goes down
                borderVisible: false,
                wickUpColor: 'red',
                wickDownColor:'green'
            });
            // console.log(chart.current +  " " + candlestickSeries +  "\n");
        }

        if (candlestickSeries.current && candlestickData.length > 0) {
            candlestickSeries.current.setData(candlestickData);
        }
    }, [candlestickData]);

    return (
        <div className="h-[100%] w-[100%] flex flex-col items-center justify-center text-white">
            <div className="h-[80%] w-[70%]" ref={chartRef}></div>
            <button onClick={Print}>click</button>
        </div>
    );
}

export default Kline;
