import { getExistingShapes } from "./http"

export class Game {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private existingShapes: Shape[]
    private roomId: string
    private socket: WebSocket
    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas
        this.roomId = roomId
        this.ctx = canvas.getContext('2d')!
        this.socket = socket
        this.existingShapes = []
        this.init()
        this.initHandlers()
        this.initMouseHandlers()

    }
    async init() {
        this.existingShapes = await getExistingShapes(this.roomId)

    }
    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data)
            if (message.type == 'chat') {
                const parsedShape: Shape = JSON.parse(message.message)
                this.existingShapes.push(parsedShape)
                // this.clearCanvas(this.existingShapes, this.canvas)
                this.clearCanvas()

            }

        }
    }
    // clearCanvas(existingShapes: Shape[] = [], canvas: HTMLCanvasElement) {
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = ('rgba(0, 0, 0)')
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.existingShapes.map((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(255, 255, 255)"
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
            }
            else if (shape.type === 'circle') {
                this.ctx.strokeStyle = "rgba(255, 255, 255)"
                this.ctx.beginPath()
                this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2)
                this.ctx.stroke()
                this.ctx.closePath()
            }
            else if (shape.type === 'line') {
                this.ctx.strokeStyle = "rgba(255, 255, 255)"
                this.ctx.beginPath()
                this.ctx.moveTo(shape.initialX, shape.initialY)
                this.ctx.lineTo(shape.finalX, shape.finalY)
                this.ctx.stroke()
                this.ctx.closePath()
            }

        })
    }
    initMouseHandlers(){
        
    }


}