const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            let date = new Date()
            date.setSeconds(date.getSeconds() + 1800)

            const session = await stripe.checkout.sessions.create({
                line_items: req.body.lineItems.map((item) => ({
                    price_data: {
                        currency: 'CAD',
                        product_data: {
                            name: item.name
                        },
                        unit_amount_decimal: item.price * 100
                    },
                    quantity: item.quantity
                })),
                customer_email: req.body.customerEmail,
                payment_intent_data: {
                    receipt_email: req.body.customerEmail
                },
                mode: 'payment',
                expires_at: Math.floor(date.getTime() / 1000), // expires in 30 minutes in epoch time
                success_url: `${req.headers.origin}/checkout?success=true`,
                cancel_url: `${req.headers.origin}/checkout?canceled=true`
            })

            res.json({ session })
        } catch (error) {
            res.status(error.statusCode || 500).json(error.message)
        }
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method Not Allowed')
    }
}
