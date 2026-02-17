'use client'
import { initDraw } from "@/lib/draw"
import { Circle, RectangleHorizontalIcon, Slash } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import IconButton from "./icon-button"
type SelectedToolType = 'circle' | 'rect' | 'line'
export default function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedTool, setselectedTool] = useState<SelectedToolType>('rect')

    useEffect(() => {
        // @ts-expect-error fhe
        window.selectedTool = selectedTool
    }, [selectedTool])
    
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            initDraw(canvas, roomId, socket)
        }
    }, [canvasRef, roomId, socket])

    return <div className="fixed inset-0 overflow-hidden bg-background">
        <div className="absolute top-4 left-4 z-10 flex gap-2 w-full justify-center items-center">
            <div className="flex justify-center items-center gap-3 backdrop-blur-md">
                <IconButton 
                activated={selectedTool === 'circle'} 
                onClick={() => {
                    setselectedTool('circle')
                }}
                ><Circle strokeWidth={3} /></IconButton>
                <IconButton
                  activated={selectedTool === 'rect'}
                  onClick={() => 
                    setselectedTool('rect')
                  }
                  ><RectangleHorizontalIcon strokeWidth={3} /></IconButton>
                <IconButton
                 activated={selectedTool === 'line'}
                 onClick={() => 
                    setselectedTool('line')
                 }
                 ><Slash strokeWidth={3} /></IconButton>

            </div>
        </div>
        <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth} className="w-screen h-screen"></canvas>
    </div>

}