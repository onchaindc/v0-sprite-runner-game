"use client"

import { Card } from "@/components/ui/card"
import { Check, Lock } from "lucide-react"
import type { Checkpoint } from "@/lib/game/types"

interface CheckpointProgressProps {
  checkpoints: Checkpoint[]
  currentDistance: number
}

export function CheckpointProgress({ checkpoints, currentDistance }: CheckpointProgressProps) {
  return (
    <Card className="p-4 bg-white/90 backdrop-blur-sm">
      <h3 className="font-bold mb-3 text-sm">Checkpoints</h3>
      <div className="space-y-2">
        {checkpoints.map((checkpoint, index) => {
          const progress = Math.min(100, (currentDistance / checkpoint.distance) * 100)
          const isReached = checkpoint.reached

          return (
            <div key={checkpoint.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className={isReached ? "text-green-600 font-medium" : "text-gray-600"}>{checkpoint.name}</span>
                <div className="flex items-center gap-1">
                  {isReached ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : checkpoint.coinsRequired ? (
                    <Lock className="w-3 h-3 text-gray-400" />
                  ) : null}
                  <span>{checkpoint.distance}m</span>
                </div>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${isReached ? "bg-green-500" : "bg-blue-500"}`}
                  style={{ width: `${isReached ? 100 : progress}%` }}
                />
              </div>
              {checkpoint.coinsRequired && !isReached && (
                <p className="text-xs text-gray-500">Requires {checkpoint.coinsRequired} coins</p>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
