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
    return <Button variant={'outline'} 
    className={`rounded-lg bg-background ${activated ? 'text-blue-500' : 'text-foreground'}`}
    onClick={onClick}
    >{children}</Button>

}