import { X } from "lucide-react"
import { getExistingShapes } from "./http"

export class Game {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private existingShapes: Shape[]
    private roomId: string
    private socket: WebSocket
    private dragEndX = 0
    private dragEndY= 0
    private mouseDown: boolean
    private startX = 0
    private startY = 0
    private selectedTool: SelectedToolType
    private getPoint(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect()
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas
        this.mouseDown = false
        this.roomId = roomId
        this.ctx = canvas.getContext('2d')!
        this.socket = socket
        this.existingShapes = []
        this.init()
        this.initHandlers()
        this.initMouseHandlers()
        this.selectedTool = 'rect'

    }
    async init() {
        this.existingShapes = await getExistingShapes(this.roomId)
        this.clearCanvas()

    }
    destroy() {
        this.canvas.removeEventListener('mousedown', this.mouseDownHandler)

        this.canvas.removeEventListener('mouseup', this.mouseUpHandler)

        this.canvas.removeEventListener('mousemove', this.mouseMoveHandler)
    }
    mouseDownHandler = (e: MouseEvent) => {
        this.mouseDown = true
        const { x, y } = this.getPoint(e)
        this.startX = x
        this.startY = y
    }
    mouseUpHandler = (e: MouseEvent) => {
        this.mouseDown = false
        const { x, y } = this.getPoint(e)
        const height = y - this.startY
        const width = x - this.startX
        let shape: Shape | null = null
        if (this.selectedTool === 'rect') {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                height,
                width
            }
        }
        else if (this.selectedTool === 'circle') {
            const centerX = this.startX + width / 2
            const centerY = this.startY + height / 2
            const radius = Math.max(Math.abs(width), Math.abs(height)) / 2
            shape = {
                type: 'circle',
                centerX,
                centerY,
                radius
            }
        }
        else if (this.selectedTool === 'line') {
            shape = {
                type: 'line',
                initialX: this.startX,
                initialY: this.startY,
                finalX: x,
                finalY: y
            }
        }
        
        // console.log(e.clientX, e.clientY)
        if (!shape) {
            return
        }
        this.existingShapes.push(shape)
        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify(shape),
            roomId: this.roomId
        }))
    }
    mouseMoveHandler = (e: MouseEvent) => {
        if (!this.mouseDown) {
            return
        }
        const { x, y } = this.getPoint(e)
        const width = x - this.startX
        const height = y - this.startY
        this.clearCanvas()
        this.ctx.strokeStyle = "rgba(255, 255, 255)"
        console.log(this.selectedTool)
        if (this.selectedTool === 'rect') {
            this.ctx.strokeRect(this.startX, this.startY, width, height)
        }
        else if (this.selectedTool === 'circle') {
            const centerX = this.startX + width / 2
            const centerY = this.startY + height / 2
            const radius = Math.max(Math.abs(width), Math.abs(height)) / 2
            this.ctx.beginPath()
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
            this.ctx.stroke()
        }
        else if (this.selectedTool === 'line') {
            this.ctx.beginPath()
            this.ctx.moveTo(this.startX, this.startY)
            this.ctx.lineTo(e.clientX, e.clientY)
            this.ctx.stroke()

        }
        else if (this.selectedTool === 'pan') {
            if (this.mouseDown) {
                this.dragEndX = e.pageX - this.canvas.offsetLeft
                this.dragEndY = e.pageY - this.canvas.offsetLeft
                this.ctx.translate(this.dragEndX - this.startX, this.dragEndY - this.startY);
                this.startX = this.dragEndX
                this.startY = this.dragEndY
                this.clearCanvas()
            }
        }

        // console.log(e.clientX, e.clientY)
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
    initMouseHandlers() {
        this.canvas.addEventListener('mousedown', this.mouseDownHandler)

        this.canvas.addEventListener('mouseup', this.mouseUpHandler)

        this.canvas.addEventListener('mousemove', this.mouseMoveHandler)

    }
    setTool(tool: SelectedToolType) {
        this.selectedTool = tool

    }




}

