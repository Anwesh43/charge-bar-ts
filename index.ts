const w : number = window.innerWidth 
const h : number = window.innerHeight
const bars : number = 3 
const parts : number = 3 
const scGap : number = 0.02 / 3 
const strokeFactor : number = 90 
const barWFactor : number = 6.2 
const barHFactor : number = 14.2
const delay : number = 20 
const colors : Array<string> = [
    "#f44336",
    "#1A237E",
    "#00C853",
    "#FF6F00",
    "#2962FF"
]
const backColor : string = "#bdbdbd"

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }

    static sinify(scale : number) : number {
        return Math.sin(scale * Math.PI)
    }
}