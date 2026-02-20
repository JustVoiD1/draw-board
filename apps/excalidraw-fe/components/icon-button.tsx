'use client'

import { MouseEventHandler, ReactNode } from "react"
import { Button } from "./ui/button"

export default function IconButton({
    children,
    activated,
    onClick
}: {
    children: ReactNode,
    activated?: boolean,
    onClick?:  MouseEventHandler<HTMLButtonElement>;

}) {
    return <button 
    className={`rounded-lg hover:cursor-pointer px-1 py-1 bg-background border-2 border-muted-foreground ${activated ? 'text-blue-500' : 'text-foreground'}`}
    onClick={onClick}
    >{children}</button>

}