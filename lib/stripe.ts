import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
})

/**
 * Create a Stripe Checkout session for the given user and price.
 */
export async function createCheckoutSession(
  userId: string,
  priceId: string
): Promise<Stripe.Checkout.Session> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  // Ensure the user has a Stripe customer
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, full_name")
    .eq("id", userId)
    .single()

  const customerId = profile?.stripe_customer_id ?? undefined

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/billing?success=true`,
    cancel_url: `${appUrl}/billing?canceled=true`,
    metadata: {
      userId,
    },
  })

  return session
}

/**
 * Create a Stripe Billing Portal session for an existing customer.
 */
export async function createBillingPortalSession(
  customerId: string
): Promise<Stripe.BillingPortal.Session> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/billing`,
  })

  return session
}

/**
 * Look up a Stripe customer by userId (via profiles table), or create one if
 * none exists. Always keeps the stripe_customer_id in sync in Supabase.
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string
): Promise<string> {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, full_name")
    .eq("id", userId)
    .single()

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id
  }

  // Create a new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: profile?.full_name ?? undefined,
    metadata: { userId },
  })

  // Persist the customer id
  await supabase
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", userId)

  return customer.id
}
