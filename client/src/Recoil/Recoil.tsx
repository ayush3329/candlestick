import { Time } from "lightweight-charts";
import { atom } from "recoil";
export const webSocketRef = atom<WebSocket|null>({
    key: "webSocketRef",
    default: null
})

type stick = {
    open: number,
    close: number,
    high: number,
    low: number,
    time: Time
}

export const CandleStickData = atom<stick[]>({
    key: 'CandleStickData',
    default: []
})


