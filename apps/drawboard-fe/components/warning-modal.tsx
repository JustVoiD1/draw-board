import { Coffee } from 'lucide-react'
import React from 'react'

const WarningModal = ({ showWarning, setShowWarning }: {
    showWarning: boolean,
    setShowWarning: React.Dispatch<React.SetStateAction<boolean>>

}) => {
    return (
        <>
            {showWarning && (
                <div className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl max-w-sm w-full text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        {/* Warning Visual Icon Accent */}
                        <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-red-950/40 flex items-center justify-center mx-auto text-red-300 font-bold text-xl">
                            <Coffee color='red'/>
                        </div>

                        <div className="space-y-1">
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                                Sorry for the Brief Delay!
                            </h3>
                            <p className="text-mg text-slate-500 dark:text-slate-400 leading-relaxed">
                                As a free-tier project, it is neccessary for our HTTP and WebSocket servers to <b>idle down</b> when not in active use and not kept 24/7 active due to <b>usage limits</b>. We apologize for the wait, but the board will be fully functional in roughly 30 seconds as the instances spin back up.
                            </p>
                        </div>

                        {/* Action Dismiss Button */}
                        <button
                            onClick={() => setShowWarning(false)}
                            className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-medium text-xl rounded-lg transition-colors cursor-pointer"
                        >
                            Acknowledge & Continue
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default WarningModal