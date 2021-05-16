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
const sFactor : number = 0.1 

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

class DrawingUtil {

    static drawChargeBar(context : CanvasRenderingContext2D, scale : number) {
        const barW : number = Math.min(w, h) / barWFactor 
        const barH : number = Math.min(w, h) / barHFactor 
        const smallBarSize : number = barW * sFactor 
        const sf : number = ScaleUtil.sinify(scale)
        const sf1 : number = ScaleUtil.divideScale(sf, 0, parts)
        const sf2 : number = ScaleUtil.divideScale(sf, 1, parts)
        const sf3 : number = ScaleUtil.divideScale(sf, 2, parts)
        const gap : number = barW / bars 
        context.save()
        context.translate(w / 2, h / 2)
        context.strokeRect(-barW / 2, -barH / 2, barW * sf1, barH)
        context.fillRect(barW / 2, -smallBarSize / 2, smallBarSize * sf2, smallBarSize)
        for (var j = 0; j < bars; j++) {
            const size : number = gap - gap * sFactor 
            const x : number = -barW / 2 + gap * j + gap * 0.1
            context.save()
            context.translate(x, -barH / 2)
            context.fillRect(0, 0, gap, barH * sf3)
            context.restore()
        }
        context.restore()
    }

    static drawCBNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.fillStyle = colors[i]
        context.strokeStyle = colors[i]
        context.lineWidth = Math.min(w, h) / strokeFactor 
        DrawingUtil.drawChargeBar(context, scale)
    }
}