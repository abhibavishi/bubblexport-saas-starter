import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createBillingPortalSession } from "@/lib/stripe"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(
      new URL("/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
    )
  }

  // Look up stripe_customer_id from profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    // User has no Stripe customer — redirect to billing page with an error
    return NextResponse.redirect(
      new URL(
        "/billing?error=no_subscription",
        process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
      )
    )
  }

  try {
    const session = await createBillingPortalSession(profile.stripe_customer_id)
    return NextResponse.redirect(session.url)
  } catch (err) {
    console.error("Billing portal session error:", err)
    return NextResponse.json(
      { error: "Failed to create billing portal session" },
      { status: 500 }
    )
  }
}
