// server.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

console.log("STRIPE_SECRET_KEY =", process.env.STRIPE_SECRET_KEY);
console.log("STRIPE_WEBHOOK_SECRET =", process.env.STRIPE_WEBHOOK_SECRET);

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(bodyParser.raw({ type: "application/json" }));

console.log("🔥 Requisição recebida no /webhook");

app.post("/webhook", (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Aqui você trata os eventos
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("💰 Pagamento confirmado:", session);
    // Você pode salvar no Supabase, enviar e-mail etc.
  }

  res.status(200).json({ received: true });
});

app.listen(3001, () => {
  console.log("Servidor webhook rodando na porta 3001");
});
