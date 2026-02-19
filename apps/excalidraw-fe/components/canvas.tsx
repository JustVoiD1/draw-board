'use client'
import { Circle, Hand, RectangleHorizontalIcon, Slash } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import IconButton from "./icon-button"
import { Game } from "@/lib/game"
export default function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedTool, setselectedTool] = useState<SelectedToolType>('rect')
    const [game, setGame] = useState<Game>()

    useEffect(() => {
        game?.setTool(selectedTool)

    }, [selectedTool, game])

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            const g = new Game(canvas, roomId, socket)
            setGame(g)
            // initDraw(canvas, roomId, socket)
            return () => {
                g.destroy()

            }
        }

    }, [canvasRef])

    return <div className="fixed inset-0 overflow-hidden bg-background">
        <div className="absolute z-10 top-4 left-4 flex gap-2 w-full justify-center items-center">
            <div className="absolute flex justify-center items-center gap-3 backdrop-blur-md">
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
                {/* <IconButton
                    activated={selectedTool === 'pan'}
                    onClick={() =>
                        setselectedTool('pan')
                    }
                >< Hand strokeWidth={3} /></IconButton> */}

            </div>
        </div>
        <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth} className="w-screen h-screen"></canvas>
    </div>

}