
import { getExistingShapes } from "./http"


export function clearCanvas(existingShapes: Shape[] = [], canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = ('rgba(0, 0, 0)')
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    existingShapes.map((shape) => {
        if (shape.type === "rect") {
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        }
        else if (shape.type === 'circle') {
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.beginPath()
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2)
            ctx.stroke()
            ctx.closePath()
        }
        else if(shape.type === 'line'){
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.beginPath()
            ctx.moveTo(shape.initialX, shape.initialY)
            ctx.lineTo(shape.finalX, shape.finalY)
            ctx.stroke()
            ctx.closePath()
        }

    })
}

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {


    const ctx = canvas.getContext('2d')
    if (!ctx) {
        return
    }
    const existingShapes: Shape[] = await getExistingShapes(roomId)
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if (message.type == 'chat') {
            const parsedShape: Shape = JSON.parse(message.message)
            existingShapes.push(parsedShape)
            clearCanvas(existingShapes, canvas)

        }

    }
    clearCanvas(existingShapes, canvas)

    // ctx.fillStyle = "rgba(0, 0, 0)"
    // ctx.fillRect(0, 0, canvas.height, canvas.width)


    let mouseDown = false
    let startX = 0
    let startY = 0
    canvas.addEventListener('mousedown', function (e) {
        mouseDown = true
        startX = e.clientX
        startY = e.clientY
        // console.log(e.clientX, e.clientY)
    })
    canvas.addEventListener('mouseup', function (e) {
        mouseDown = false
        const height = e.clientY - startY
        const width = e.clientX - startX
        // @ts-expect-error dhdf
        const selectedTool = window.selectedTool
        let shape : Shape | null = null
        if(selectedTool === 'rect'){
            shape = {
                type: "rect",
                x: startX,
                y: startY,
                height,
                width
            }
        }
        else if(selectedTool === 'circle'){
            const centerX = startX + width / 2
            const centerY = startY + height / 2
            const radius = Math.max(Math.abs(width), Math.abs(height)) / 2
            shape = {
                type: 'circle',
                centerX,
                centerY,
                radius
            }
        }
        else if(selectedTool === 'line'){
            shape = {
                type: 'line',
                initialX: startX,
                initialY: startY,
                finalX: e.clientX,
                finalY: e.clientY
            }
        }
        // console.log(e.clientX, e.clientY)
        if(!shape){
            return
        }
        existingShapes.push(shape)
        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify(shape),
            roomId
        }))
    })
    canvas.addEventListener('mousemove', function (e) {
        if (mouseDown) {
            const width = e.clientX - startX
            const height = e.clientY - startY
            clearCanvas(existingShapes, canvas)
            ctx.strokeStyle = "rgba(255, 255, 255)"
            // @ts-expect-error sdhg
            const selectedTool = window.selectedTool
            console.log(selectedTool)
            if (selectedTool === 'rect') {
                ctx.strokeRect(startX, startY, width, height)
            }
            else if (selectedTool === 'circle') {
                const centerX = startX + width / 2
                const centerY = startY + height / 2
                const radius = Math.max(Math.abs(width), Math.abs(height)) / 2
                ctx.beginPath()
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
                ctx.stroke()
            }
            else if (selectedTool === 'line') {
                ctx.beginPath()
                ctx.moveTo(startX, startY)
                ctx.lineTo(e.clientX, e.clientY)
                ctx.stroke()

            }

            // console.log(e.clientX, e.clientY)
        }
    })
}



