export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });
    const { amount } = req.body;

    const host = req.headers.host || "localhost";
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const response = await fetch("https://api.plutus.ly/api/v1/transaction/localbankcards/confirm", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.API_KEY,
        "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`
      },
      body: new URLSearchParams({
        amount: amount,
        invoice_no: "INV-" + Date.now(),
        return_url: `${baseUrl}/index.html?status=success`,
        customer_ip: "127.0.0.1"
      })
    });

    const data = await response.json();
    console.log("LOCAL BANK CARDS CONFIRM:", data);

    res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
