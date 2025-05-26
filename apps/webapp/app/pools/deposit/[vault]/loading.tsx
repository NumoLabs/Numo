import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/ui/header"

export default function VaultDepositLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="dashboard" />
      <main className="flex-1 p-4 md:p-8 pt-6">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center mb-6">
            <Skeleton className="h-9 w-32" />
          </div>

          <div className="space-y-6">
            {/* Vault Information Skeleton */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-80" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {[...Array(3)].map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={i} className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                      <Skeleton className="h-6 w-6 mx-auto mb-2" />
                      <Skeleton className="h-4 w-16 mx-auto mb-1" />
                      <Skeleton className="h-6 w-12 mx-auto" />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Skeleton className="h-5 w-32" />
                  {[...Array(3)].map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-3 h-3 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-5 w-12" />
                        </div>
                        <Skeleton className="h-4 w-8" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Deposit Form Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-80" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>

                <div className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-900/20">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <div className="space-y-1">
                        {[...Array(4)].map((_, i) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          <Skeleton key={i} className="h-3 w-full" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <div key={i}>
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      {i < 3 && <Skeleton className="h-px w-full mt-3" />}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardContent className="flex flex-col space-y-3">
                <Skeleton className="h-11 w-full" />
                <div className="flex gap-2 w-full">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
