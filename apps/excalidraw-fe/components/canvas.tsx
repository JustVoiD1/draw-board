'use client'
import { Circle, Eraser, Pencil, RectangleHorizontalIcon, Redo2, Slash, Undo2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import IconButton from "./icon-button"
import { Game } from "@/lib/game"
export default function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedTool, setselectedTool] = useState<SelectedToolType>('rect')
    const [game, setGame] = useState<Game>()
    const gameRef = useRef<Game>(null)

    useEffect(() => {
        gameRef.current?.setTool(selectedTool)

    }, [selectedTool, game])

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            const g = new Game(canvas, roomId, socket)
            gameRef.current = g
            setGame(g)
            // initDraw(canvas, roomId, socket)
            return () => {
                g.destroy()

            }
        }

    }, [canvasRef])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.code === "KeyZ") {
                e.preventDefault()
                gameRef.current?.undo()
            } else if ((e.ctrlKey || e.metaKey) && (e.code === "KeyY")) {
                e.preventDefault()
                gameRef.current?.redo()

            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])


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
                <IconButton
                    activated={selectedTool === 'eraser'}
                    onClick={() =>
                        setselectedTool('eraser')
                    }
                >< Eraser strokeWidth={3} /></IconButton>
                <IconButton
                    activated={selectedTool === 'pencil'}
                    onClick={() =>
                        setselectedTool('pencil')
                    }
                >< Pencil strokeWidth={3} /></IconButton>
                <IconButton
                    activated={false}
                    onClick={() =>
                        gameRef.current?.undo()
                    }
                >< Undo2 strokeWidth={3} /></IconButton>
                <IconButton
                    activated={false}
                    onClick={() =>
                        gameRef.current?.redo()
                    }
                >< Redo2 strokeWidth={3} /></IconButton>

            </div>
        </div>
        <canvas ref={canvasRef} className={`${selectedTool === "eraser" ? "cursor-[url('/eraser-cursor.svg')_6_6,_auto]" : "cursor-crosshair"} w-screen h-screen`}></canvas>
    </div>

}