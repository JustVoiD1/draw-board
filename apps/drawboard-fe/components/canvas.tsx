'use client'
import { Circle, Download, Eraser, Hand, Import, MousePointer2, Pencil, PencilIcon, RectangleHorizontalIcon, Slash, Upload, User } from "lucide-react"
import { ReactNode, useEffect, useRef, useState } from "react"
import IconButton from "./icon-button"
import { Game } from "@/lib/game"
export default function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedTool, setselectedTool] = useState<SelectedToolType>('rect')
    const IconButtons: { tool: SelectedToolType, icon: ReactNode }[] = [
        {
            tool: 'circle',
            icon: <Circle />
        },
        {
            tool: 'rect',
            icon: <RectangleHorizontalIcon />
        },
        {
            tool: 'line',
            icon: <Slash />

        }, {
            tool: 'pencil',
            icon: <Pencil />
        }, {
            tool: 'eraser',
            icon: <Eraser />
        }, {
            tool: 'selection',
            icon: <MousePointer2 />
        }
    ]

    const fileButtons = [
        {
        tool: 'import',
        icon: <Import />
        },
        {
        tool: 'export',
        icon: <Upload />
        }
    ]

    const cursors: Record<SelectedToolType, string> = {
        circle: "cursor-crosshair",
        rect: "cursor-crosshair",
        line: "cursor-crosshair",
        eraser: "cursor-[url('/eraser-cursor.svg')_6_6,auto]",
        pencil: "cursor-[url('/pencil-cursor.svg')_3_22,auto]",
        selection: "cursor-move",
    }



    // const [game, setGame] = useState<Game>()
    const gameRef = useRef<Game>(null)

    useEffect(() => {
        gameRef.current?.setTool(selectedTool)

    }, [selectedTool])

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current
            const g = new Game(canvas, roomId, socket)
            gameRef.current = g
            // initDraw(canvas, roomId, socket)
            return () => {
                g.destroy()

            }
        }

    }, [canvasRef])



    return (
        <div className="fixed inset-0 flex flex-col bg-background">
            {/* Top Bar */}
            <div className="h-16 bg-background border-b border-border flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <PencilIcon />
                    </div>
                    <h1 className="text-lg font-semibold">Drawboard</h1>
                </div>

                {/* Tools in Top Bar */}
                <div className="flex items-center gap-2 backdrop-blur-sm">
                    {IconButtons.map((x) => (
                        <IconButton
                            key={x.tool}
                            activated={selectedTool === x.tool}
                            onClick={() => setselectedTool(x.tool as SelectedToolType)}
                        >
                            {x.icon}
                        </IconButton>
                    ))}
                </div>

                <div className="flex items-center gap-2 border-r pr-2 border-border">
                    <button
                        onClick={() => gameRef.current?.exportToPNG()}
                        className="px-2 py-1 text-xs font-medium rounded border hover:bg-accent"
                    >
                        PNG
                    </button>
                    <button
                        onClick={() => gameRef.current?.exportToSVG()}
                        className="px-2 py-1 text-xs font-medium rounded border hover:bg-accent"
                    >
                        SVG
                    </button>
                    <button
                        onClick={() => gameRef.current?.exportToJSON()}
                        className="px-2 py-1 text-xs font-medium rounded border hover:bg-accent"
                    >
                        <Import />
                    </button>

                    {/* Hidden Upload Handler to Restore JSON Sessions */}
                    <label className="px-2 py-1 text-xs font-medium rounded border cursor-pointer hover:bg-accent">
                        <Upload />
                        <input
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    const text = event.target?.result as string;
                                    gameRef.current?.importFromJSON(text);
                                };
                                reader.readAsText(file);
                            }}
                        />
                    </label>
                </div>
            </div>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className={`flex-1 ${cursors[selectedTool]}`}
            />
        </div>
    )

}