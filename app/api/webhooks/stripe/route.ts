import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

// Use service role key so we can bypass RLS for webhook writes
function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription

        // Find the user by stripe_customer_id
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id

        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single()

        if (!profile) {
          console.warn("No profile found for customer", customerId)
          break
        }

        const priceId = subscription.items.data[0]?.price.id ?? "unknown"

        await supabase.from("subscriptions").upsert(
          {
            user_id: profile.id,
            stripe_subscription_id: subscription.id,
            plan: priceId,
            status: subscription.status,
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          },
          { onConflict: "stripe_subscription_id" }
        )
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id)
        break
      }

      default:
        // Ignore unhandled event types
        break
    }
  } catch (err) {
    console.error("Error handling Stripe webhook event:", err)
    return NextResponse.json(
      { error: "Webhook handler error" },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}
