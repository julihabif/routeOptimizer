"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function RoutesSkeleton() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <Skeleton className="h-10 w-full max-w-md" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-3/4">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>

              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-start">
                    <Skeleton className="h-6 w-6 rounded-full mr-2" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 px-6 py-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-24 ml-auto" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

