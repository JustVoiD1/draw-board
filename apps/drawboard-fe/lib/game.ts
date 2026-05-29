import { getExistingShapes } from "./http"

export class Game {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private existingShapes: Shape[]
    private roomId: string
    private socket: WebSocket

    private mouseDown: boolean
    private startX = 0
    private startY = 0

    private dragEndX = 0
    private dragEndY = 0
    // private history: Shape[][] = []
    // private redoStack: Shape[][] = []
    // private maxHistorySize = 50
    private selectedTool: SelectedToolType
    private eraserRadius = 5 // Eraser detection radius
    private tolerance = 5

    private selectedElement: number | undefined = undefined
    private selectedShape: Shape | undefined = undefined
    private getPoint(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect()
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    private getBoundingBox(shape: Shape) {
        if (shape.type === 'rect') {
            const x = Math.min(shape.x, shape.x + shape.width)
            const y = Math.min(shape.y, shape.y + shape.height)
            const w = Math.abs(shape.width)
            const h = Math.abs(shape.height)
            return { x, y, w, h }
        }
        if (shape.type === 'circle') {
            return { x: shape.centerX - shape.radius, y: shape.centerY - shape.radius, w: shape.radius * 2, h: shape.radius * 2 }
        }
        if (shape.type === 'line') {
            const minX = Math.min(shape.initialX, shape.finalX)
            const minY = Math.min(shape.initialY, shape.finalY)
            const w = Math.abs(shape.finalX - shape.initialX)
            const h = Math.abs(shape.finalY - shape.initialY)
            return { x: minX, y: minY, w, h }
        }
        if (shape.type === 'pencil') {
            const xs = shape.points.map(p => p.x)
            const ys = shape.points.map(p => p.y)
            const minX = Math.min(...xs)
            const minY = Math.min(...ys)
            const w = Math.max(...xs) - minX
            const h = Math.max(...ys) - minY
            return { x: minX, y: minY, w, h }
        }
        return { x: 0, y: 0, w: 0, h: 0 }
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
    private isPointNearRectangle(x: number, y: number, rect: Rectangle): boolean {
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

    private isPointNearCircle(x: number, y: number, circle: Circle): boolean {

        const dx = x - circle.centerX;
        const dy = y - circle.centerY;
        const distSq = dx * dx + dy * dy;

        const outer = (circle.radius + this.eraserRadius) ** 2;
        const inner = Math.max(0, circle.radius - this.eraserRadius) ** 2;

        return distSq <= outer && distSq >= inner;
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

    private isPointNearShape(x: number, y: number, shape: Shape): boolean {
        if (shape.type === 'rect') {
            return this.isPointNearRectangle(x, y, shape)
        }
        else if (shape.type === 'circle') {
            return this.isPointNearCircle(x, y, shape)
        }
        else if (shape.type === 'line') {
            return this.isPointNearLine(x, y, shape)
        }
        else if (shape.type === 'pencil') {
            return this.isPointNearPencilStroke(x, y, shape)
        }
        return false
    }



    private isPointInRectangle(x: number, y: number, rect: Rectangle): boolean {
        const minX = Math.min(rect.x, rect.x + rect.width)
        const maxX = Math.max(rect.x, rect.x + rect.width)
        const minY = Math.min(rect.y, rect.y + rect.height)
        const maxY = Math.max(rect.y, rect.y + rect.height)

        const isInside =
            x >= minX - this.tolerance &&
            x <= maxX + this.tolerance &&
            y >= minY - this.tolerance &&
            y <= maxY + this.tolerance;

        if (!isInside) return false;
        return true;
    }
    private isPointInLine(x: number, y: number, line: Line): boolean {
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

        return distance <= this.tolerance
    }
    private isPointInPencilStroke(x: number, y: number, pencil: Pencil): boolean {
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
            if (distanceSquared <= (this.tolerance * this.tolerance)) {
                return true
            }


        }
        return false
    }
    private isPointInCircle(x: number, y: number, circle: Circle): boolean {
        const distance = Math.sqrt(
            Math.pow(x - circle.centerX, 2) + Math.pow(y - circle.centerY, 2)
        )
        return distance <= circle.radius + this.tolerance
    }

    private isPointInShape(x: number, y: number, shape: Shape): boolean {
        if (shape.type === 'rect') {
            return this.isPointInRectangle(x, y, shape)
        }
        else if (shape.type === 'circle') {
            return this.isPointInCircle(x, y, shape)
        }
        else if (shape.type === 'line') {
            return this.isPointInLine(x, y, shape)
        }
        else if (shape.type === 'pencil') {
            return this.isPointInPencilStroke(x, y, shape)
        }
        return false
    }

    private updateElement(id: number, x: number, y: number) {
        const shape = this.existingShapes[id]
        if (!shape) return;

        const newX = x - this.dragEndX
        const newY = y - this.dragEndY
        if (shape.type === 'rect') {
            shape.x = newX
            shape.y = newY

            shape.width = Math.abs(shape.width)
            shape.height = Math.abs(shape.height)
        }
        if (shape.type === 'circle') {
            shape.centerX = newX
            shape.centerY = newY

        }
        if (shape.type === 'line') {
            const dx = newX - shape.initialX
            const dy = newY - shape.initialY
            shape.initialX += dx
            shape.initialY += dy
            shape.finalX += dx
            shape.finalY += dy
        }
        if (shape.type === 'pencil') {
            const dx = newX - shape.points[0].x
            const dy = newY - shape.points[0].y
            for (const p of shape.points) { p.x += dx; p.y += dy }

        }
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
        this.dragEndX = x
        this.dragEndY = y
        if (this.selectedTool === 'selection') {
            this.selectedElement = this.existingShapes.findIndex((shape) => this.isPointInShape(x, y, shape))
            // console.log(this.selectedElement)
            const shape = this.existingShapes[this.selectedElement] || undefined
            this.selectedShape = structuredClone(shape)

            if (!shape) return
            if (shape.type === 'rect') {
                const minX = Math.min(shape.x, shape.x + shape.width)
                const minY = Math.min(shape.y, shape.y + shape.height)
                this.dragEndX = x - minX
                this.dragEndY = y - minY
            }
            else if (shape.type === 'circle') {
                this.dragEndX = x - shape.centerX
                this.dragEndY = y - shape.centerY
            }
            else if (shape.type === 'line') {
                this.dragEndX = x - shape.initialX
                this.dragEndY = y - shape.initialY
            }
            else if (shape.type === 'pencil') {
                const first = shape.points[0]
                this.dragEndX = x - first.x
                this.dragEndY = y - first.y
            }
        }

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

        else if (this.selectedTool === 'selection') {
            if (this.selectedElement === undefined || this.selectedElement === -1) return

            const updatedShape = this.existingShapes.find((shape, index) => index === this.selectedElement)
            // console.log('shape to move', updatedShape)
            // console.log('old shape', this.selectedShape)

            if (!updatedShape) return


            this.socket.send(JSON.stringify({
                type: "update_shape",
                shapeIndex: this.selectedElement,
                updatedShape: JSON.stringify(updatedShape),
                oldShape: JSON.stringify(this.selectedShape),
                roomId: this.roomId
            }))

            this.selectedElement = undefined
            this.selectedShape = undefined



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
                if (this.isPointNearShape(x, y, shape)) {
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

        if (this.selectedTool === 'selection') {
            if (this.selectedElement !== undefined && this.selectedElement !== -1) {

                this.updateElement(this.selectedElement, x, y)
            }
        }

        this.clearCanvas()
        this.ctx.strokeStyle = "rgba(255, 255, 255)"
        // console.log(this.selectedTool)
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

            else if (message.type === 'update_shape') {
                // type: "update_shape",
                // shapeIndex: this.selectedElement,
                // updatedShape: JSON.stringify(updatedShape),
                // oldShape: JSON.stringify(this.selectedShape),
                // roomId: this.roomId 
                // const shapeIndex = Number(message.shapeIndex)
                const idx = this.existingShapes.findIndex(s => JSON.stringify(s) === message.oldShape)
                if (idx == -1) return

                const updatedShape = JSON.parse(message.updatedShape)
                this.existingShapes[idx] = updatedShape
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


        // draw selection highlight
        if (this.selectedElement !== undefined && this.selectedElement !== -1) {
            const s = this.existingShapes[this.selectedElement]
            if (s) {
                const { x, y, w, h } = this.getBoundingBox(s)
                this.ctx.save()
                const grad = 'rgba(173, 216, 230, 0.5)'
                this.ctx.strokeStyle = grad
                this.ctx.lineWidth = 2
                this.ctx.setLineDash([6, 4])
                this.ctx.strokeRect(x - 4, y - 4, w + 8, h + 8) // padding so outline isn't tight
                this.ctx.setLineDash([])
                this.ctx.restore()
            }
        }

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

