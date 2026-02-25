type Shape = Rectangle | Circle | Line | Pencil
type Rectangle = {
    type: "rect",
    x: number,
    y: number,
    height: number,
    width: number
}

type Circle = {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number

}
type Line = {
    type: "line",
    initialX: number,
    initialY: number,
    finalX: number,
    finalY: number

}

type Pencil = {
  type: "pencil"
  points: { x: number; y: number }[]
  strokeWidth: number
  color: string
}

interface MessageType {
    id: number,
    message: string,
    roomId: number,
    userId: string,
    createdAt: string
}

type SelectedToolType = 'circle' | 'rect' | 'line' | 'eraser' | 'pencil'

type Room = {
    slug: string
    createdAt: string
}

