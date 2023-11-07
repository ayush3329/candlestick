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

export type interval_num = {
    interval: string,
    range: number
}

export const duration = atom<interval_num>({
    key: 'duration',
    default: {
        interval: 'sec',
        range: 1
    }
})


