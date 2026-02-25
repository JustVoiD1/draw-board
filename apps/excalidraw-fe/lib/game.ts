import { getExistingShapes } from "./http"

export class Game {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private existingShapes: Shape[]
    private roomId: string
    private socket: WebSocket
    private dragEndX = 0
    private dragEndY = 0

    private mouseDown: boolean
    private startX = 0
    private startY = 0
    // private history: Shape[][] = []
    // private redoStack: Shape[][] = []
    // private maxHistorySize = 50
    private selectedTool: SelectedToolType
    private eraserRadius = 5 // Eraser detection radius
    private getPoint(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect()
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    private resizeCanvas = () => {
        const rect = this.canvas.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1

        this.canvas.width = rect.width * dpr
        this.canvas.height = rect.height * dpr

        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        this.clearCanvas()
    }

    // Collision detection methods
    private isPointInRectRing(x: number, y: number, rect: Rectangle): boolean {
        const minX = Math.min(rect.x, rect.x + rect.width)
        const maxX = Math.max(rect.x, rect.x + rect.width)
        const minY = Math.min(rect.y, rect.y + rect.height)
        const maxY = Math.max(rect.y, rect.y + rect.height)

        const insideOuter =
            x >= minX - this.eraserRadius &&
            x <= maxX + this.eraserRadius &&
            y >= minY - this.eraserRadius &&
            y <= maxY + this.eraserRadius;

        if (!insideOuter) return false;

        const insideInner =
            x >= minX + this.eraserRadius &&
            x <= maxX - this.eraserRadius &&
            y >= minY + this.eraserRadius &&
            y <= maxY - this.eraserRadius;

        // true only if inside outer but NOT inner
        return !insideInner;
    }

    private isPointInCircleRing(
        x: number,
        y: number,
        circle: Circle,
    ): boolean {

        const dx = x - circle.centerX;
        const dy = y - circle.centerY;
        const distSq = dx * dx + dy * dy;

        const outer = (circle.radius + this.eraserRadius) ** 2;
        const inner = Math.max(0, circle.radius - this.eraserRadius) ** 2;

        return distSq <= outer && distSq >= inner;
    }

    private isPointInCircle(x: number, y: number, circle: Circle): boolean {
        const distance = Math.sqrt(
            Math.pow(x - circle.centerX, 2) + Math.pow(y - circle.centerY, 2)
        )
        return distance <= circle.radius
    }

    private isPointNearLine(x: number, y: number, line: Line): boolean {
        // Calculate distance from point to line segment
        const A = x - line.initialX
        const B = y - line.initialY
        const C = line.finalX - line.initialX
        const D = line.finalY - line.initialY

        const dot = A * C + B * D
        const lenSq = C * C + D * D
        let param = -1

        if (lenSq !== 0) param = dot / lenSq

        let xx, yy

        if (param < 0) {
            xx = line.initialX
            yy = line.initialY
        } else if (param > 1) {
            xx = line.finalX
            yy = line.finalY
        } else {
            xx = line.initialX + param * C
            yy = line.initialY + param * D
        }

        const dx = x - xx
        const dy = y - yy
        const distance = Math.sqrt(dx * dx + dy * dy)

        return distance <= this.eraserRadius
    }

    private isPointNearPencilStroke(x: number, y: number, pencil: Pencil) {
        for (let i = 0; i < pencil.points.length - 1; i++) {
            const p1 = pencil.points[i]
            const p2 = pencil.points[i + 1]

            const A = x - p1.x
            const B = y - p1.y
            const C = p2.x - p1.x
            const D = p2.y - p1.y

            const dotProduct = A * C + B * D
            const lenSquared = C * C + D * D

            let param = -1

            if (lenSquared !== 0) param = dotProduct / lenSquared

            let xx, yy
            if (param < 0) {
                xx = p1.x
                yy = p1.y
            }
            else if (param > 1) {
                xx = p2.x
                yy = p2.y

            }
            else {
                xx = p1.x + param * C
                yy = p1.y + param * D
            }

            const dx = x - xx
            const dy = y - yy

            const distanceSquared = dx * dx + dy * dy
            if (distanceSquared <= (this.eraserRadius * this.eraserRadius)) {
                return true
            }


        }
        return false

    }

    private isPointInShape(x: number, y: number, shape: Shape): boolean {
        if (shape.type === 'rect') {
            return this.isPointInRectRing(x, y, shape)
        }
        else if (shape.type === 'circle') {
            return this.isPointInCircleRing(x, y, shape)
        }
        else if (shape.type === 'line') {
            return this.isPointNearLine(x, y, shape)
        }
        else if (shape.type === 'pencil') {
            return this.isPointNearPencilStroke(x, y, shape)
        }
        return false
    }

    // private pushHistory() {
    //     if (this.existingShapes.length >= 0) {

    //         this.history.push(structuredClone(this.existingShapes))
    //         if (this.history.length > this.maxHistorySize) {
    //             this.history.shift()
    //         }
    //         this.redoStack = []
    //     }
    // }

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
        this.resizeCanvas()
        window.addEventListener("resize", this.resizeCanvas)

    }
    async init() {
        this.existingShapes = await getExistingShapes(this.roomId)
        // this.pushHistory()
        this.clearCanvas()


    }
    destroy() {
        this.canvas.removeEventListener('mousedown', this.mouseDownHandler)

        this.canvas.removeEventListener('mouseup', this.mouseUpHandler)

        this.canvas.removeEventListener('mousemove', this.mouseMoveHandler)
        window.removeEventListener("resize", this.resizeCanvas)
    }
    mouseDownHandler = (e: MouseEvent) => {
        this.mouseDown = true
        const { x, y } = this.getPoint(e)
        this.startX = x
        this.startY = y

        if (this.selectedTool === 'pencil') {
            const pencil: Pencil = {
                type: "pencil",
                points: [{ x, y }],
                strokeWidth: 1,
                color: "rgba(255, 255, 255)"
            }
            this.existingShapes.push(pencil)
            return
        }
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
        else if (this.selectedTool === "pencil") {
            const last = this.existingShapes[this.existingShapes.length - 1]
            if (last && last.type === "pencil") {
                this.socket.send(JSON.stringify({
                    type: "chat",
                    message: JSON.stringify(last),
                    roomId: this.roomId
                }))
                // this.pushHistory()
            }
            return
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
        // this.pushHistory()
    }
    mouseMoveHandler = (e: MouseEvent) => {
        if (!this.mouseDown) {
            return
        }
        const { x, y } = this.getPoint(e)
        const width = x - this.startX
        const height = y - this.startY

        // Eraser functionality
        if (this.selectedTool === 'eraser') {
            // Find shapes that intersect with the eraser
            const shapesToRemove: number[] = []
            this.existingShapes.forEach((shape, index) => {
                if (this.isPointInShape(x, y, shape)) {
                    shapesToRemove.push(index)
                }
            })

            // Remove shapes and notify via WebSocket
            if (shapesToRemove.length > 0) {
                // Remove from back to front to maintain indices
                for (let i = shapesToRemove.length - 1; i >= 0; i--) {
                    const removedShape = this.existingShapes.splice(shapesToRemove[i], 1)[0]
                    // Notify other clients about the deletion
                    this.socket.send(JSON.stringify({
                        type: "erase",
                        shapeIndex: shapesToRemove[i],
                        shape: JSON.stringify(removedShape),
                        roomId: this.roomId
                    }))
                }
                // this.pushHistory()
                this.clearCanvas()
            }

            // Draw eraser cursor
            this.ctx.strokeStyle = "rgba(255, 255, 255, 0)"
            this.ctx.beginPath()
            this.ctx.arc(x, y, this.eraserRadius, 0, Math.PI * 2)
            this.ctx.stroke()
            return
        }

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
            this.ctx.lineTo(x, y)
            this.ctx.stroke()

        }
        else if (this.selectedTool === 'pencil') {
            const last = this.existingShapes[this.existingShapes.length - 1]
            if (last && last.type === "pencil") {
                last.points.push({ x, y })
            }
            return
        }

        // console.log(e.clientX, e.clientY)
    }
    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data)
            if (message.type == 'chat') {
                const parsedShape: Shape = JSON.parse(message.message)
                this.existingShapes.push(parsedShape)
                this.clearCanvas()
            } else if (message.type === 'erase') {
                // Handle shape deletion from other clients
                // Note: This is a simplified approach. In production, you'd want to
                // sync shapes with unique IDs for more reliable deletion
                const deletedShape = message.shape
                const index = this.existingShapes.findIndex(shape =>
                    JSON.stringify(shape) === deletedShape
                )
                if (index !== -1) {
                    this.existingShapes.splice(index, 1)
                    this.clearCanvas()
                }
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
            else if (shape.type === "pencil") {
                this.ctx.strokeStyle = shape.color
                this.ctx.lineWidth = shape.strokeWidth
                this.ctx.beginPath()
                const [first, ...rest] = shape.points
                if (first) {
                    this.ctx.moveTo(first.x, first.y)
                    for (const p of rest) {
                        this.ctx.lineTo(p.x, p.y)
                    }
                    this.ctx.stroke()
                }
                this.ctx.closePath()
                this.ctx.lineWidth = 1
            }

        })

        this.ctx.restore()
    }
    initMouseHandlers() {
        this.canvas.addEventListener('mousedown', this.mouseDownHandler)

        this.canvas.addEventListener('mouseup', this.mouseUpHandler)

        this.canvas.addEventListener('mousemove', this.mouseMoveHandler)

    }
    setTool(tool: SelectedToolType) {
        this.selectedTool = tool

    }

    // public undo(): void {

    //     if (this.history.length < 2) return
    //     this.redoStack.push(structuredClone(this.existingShapes))
    //     this.history.pop()
    //     this.existingShapes = structuredClone(this.history[this.history.length - 1])
    //     this.clearCanvas()

    //     console.log(this.existingShapes)

    //     this.socket.send(JSON.stringify({
    //         type: "sync_shapes",
    //         shapes: this.existingShapes,
    //         roomId: this.roomId
    //     }))
    // }

    // public redo(): void {
    //     if (this.redoStack.length === 0) return
    //     this.history.push(structuredClone(this.existingShapes))
    //     this.existingShapes = structuredClone(this.redoStack.pop()!)
    //     this.clearCanvas()

    //     console.log(this.existingShapes)

    //     this.socket.send(JSON.stringify({
    //         type: "sync_shapes",
    //         shapes: this.existingShapes,
    //         roomId: this.roomId
    //     }))

    // }




}

