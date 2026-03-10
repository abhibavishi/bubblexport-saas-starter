import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TransactionsTable } from "@/components/wallet/transactions-table"
import { PaymentMethodSelector } from "@/components/wallet/payment-method-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function WalletPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, amount, method, status, fees, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Calculate earnings from paid transactions
  const earnings = (transactions ?? [])
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + (t.amount - t.fees), 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground text-sm">Manage your earnings and payment methods.</p>
      </div>

      {/* Top row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentMethodSelector />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Earnings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-3xl font-bold tabular-nums">${earnings.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-1">Net earnings (paid transactions)</p>
            </div>
            <Button className="w-full">Withdraw all earnings</Button>
          </CardContent>
        </Card>
      </div>

      {/* Transactions table */}
      <div>
        <h2 className="text-base font-semibold mb-3">Transactions</h2>
        <TransactionsTable data={transactions ?? []} />
      </div>
    </div>
  )
}
