'use client'

import { useEffect, useRef } from "react"

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {

        if (canvasRef.current) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            if(!ctx) {
                return
            }
            let mouseDown = false
            let startX = 0
            let startY = 0
            canvas.addEventListener('mousedown', function(e){
                mouseDown = true
                startX = e.clientX
                startY = e.clientY
                console.log(e.clientX, e.clientY)
            })
            canvas.addEventListener('mouseup', function(e){
                mouseDown = false
                console.log(e.clientX, e.clientY)
            })
            canvas.addEventListener('mousemove', function(e){
                const width = e.clientX - startX
                const height = e.clientY - startY
                if(mouseDown) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                    ctx.strokeRect(startX, startY, width, height)
                    console.log(e.clientX, e.clientY)
                }
            })
        }

        return () => {

        }
    }, [canvasRef])

    return <canvas ref={canvasRef} height={500} width={500} className="border border-foreground "></canvas>
}