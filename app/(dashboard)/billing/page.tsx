import { redirect } from "next/navigation"
import { CheckCircle2, XCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const PRO_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? "price_pro"

const planFeatures = [
  { feature: "Projects", free: "3", pro: "Unlimited" },
  { feature: "Team members", free: "1", pro: "10" },
  { feature: "Analytics", free: false, pro: true },
  { feature: "Custom domain", free: false, pro: true },
  { feature: "Priority support", free: false, pro: true },
  { feature: "API access", free: false, pro: true },
]

export default async function BillingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, stripe_customer_id")
    .eq("id", user.id)
    .single()

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  const isPro =
    subscription?.status === "active" || subscription?.status === "trialing"
  const renewalDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Billing"
        userEmail={user.email}
        userFullName={profile?.full_name}
        userAvatarUrl={profile?.avatar_url}
      />

      <div className="flex-1 space-y-6 p-6 max-w-3xl">
        {/* Current plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current plan</CardTitle>
                <CardDescription>
                  {isPro
                    ? "You are on the Pro plan."
                    : "You are on the Free plan."}
                </CardDescription>
              </div>
              <Badge variant={isPro ? "default" : "secondary"}>
                {isPro ? "Pro" : "Free"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isPro ? (
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  Status:{" "}
                  <span className="font-medium text-foreground capitalize">
                    {subscription?.status}
                  </span>
                </p>
                {renewalDate && (
                  <p>
                    Renews on:{" "}
                    <span className="font-medium text-foreground">
                      {renewalDate}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Upgrade to Pro to unlock unlimited projects, team members, and
                more.
              </p>
            )}
          </CardContent>
          <CardFooter className="gap-3">
            {!isPro && (
              <Button asChild>
                <a href="/api/billing/create-checkout">Upgrade to Pro — $29/mo</a>
              </Button>
            )}
            {isPro && profile?.stripe_customer_id && (
              <Button variant="outline" asChild>
                <a href="/api/billing/portal">Manage billing</a>
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Plan comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Plan comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Free</TableHead>
                  <TableHead>Pro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {planFeatures.map((row) => (
                  <TableRow key={row.feature}>
                    <TableCell className="font-medium">{row.feature}</TableCell>
                    <TableCell>
                      {typeof row.free === "boolean" ? (
                        row.free ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )
                      ) : (
                        row.free
                      )}
                    </TableCell>
                    <TableCell>
                      {typeof row.pro === "boolean" ? (
                        row.pro ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )
                      ) : (
                        row.pro
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
