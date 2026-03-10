import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createCheckoutSession } from "@/lib/stripe"

const PRO_PRICE_ID =
  process.env.STRIPE_PRO_PRICE_ID ?? process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? ""

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

  if (!PRO_PRICE_ID) {
    return NextResponse.json(
      { error: "STRIPE_PRO_PRICE_ID is not configured" },
      { status: 500 }
    )
  }

  try {
    const session = await createCheckoutSession(user.id, PRO_PRICE_ID)

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session URL" },
        { status: 500 }
      )
    }

    return NextResponse.redirect(session.url)
  } catch (err) {
    console.error("Checkout session error:", err)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
