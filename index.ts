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

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D 
    renderer : Renderer = new Renderer()

    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor 
        this.context.fillRect(0, 0, w, h)
        this.renderer.render(this.context)
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.renderer.handleTap(() => {
                this.render()
            })
        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {

    scale : number = 0 
    dir : number = 0 
    prevScale : number = 0 

    update(cb : Function) {
        this.scale += this.dir * scGap 
        if (Math.abs(this.scale - this.prevScale)  > 1) {
            this.scale = this.prevScale + this.dir 
            this.dir = 0 
            this.prevScale = this.scale 
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale 
            cb()
        }
    }
}

class Animator {

    animated : boolean = false 
    interval : number 

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true 
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false 
            clearInterval(this.interval)
        }
    }
}

class CBNode {
    
    prev : CBNode 
    next : CBNode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new CBNode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawCBNode(context, this.i, this.state.scale)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : CBNode {
        var curr : CBNode = this.prev 
        if (dir == 1) {
            curr = this.next 
        }
        if (curr) {
            return curr
        } 
        cb()
        return this 
    }
}

class ChangeBar {

    curr : CBNode = new CBNode(0)
    dir : number = 1

    draw(context : CanvasRenderingContext2D) {
        this.curr.draw(context)
    }

    update(cb : Function) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }

    startUpdating(cb : Function) {
        this.curr.startUpdating(cb)
    }
}

class Renderer {

    cb : ChangeBar = new ChangeBar()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.cb.draw(context)
    }

    handleTap(cb : Function) {
        this.cb.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.cb.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}