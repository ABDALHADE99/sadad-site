export default async function handler(req, res) {
  try {
    const { process_id, code, amount } = req.body;

    const response = await fetch("https://api.plutus.ly/api/v1/transaction/edfali/confirm", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.API_KEY,
        "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`
      },
      body: new URLSearchParams({
        process_id: process_id,
        code: code,
        amount: amount || "10",
        invoice_no: "INV-" + Date.now(),
        customer_ip: "127.0.0.1"
      })
    });

    const data = await response.json();

    console.log("CONFIRM:", data);

    if (data.status === 200) {
      return res.json({ message: "✅ تم الدفع بنجاح", data });
    }

    res.status(response.status || 400).json({ message: "❌ فشل الدفع", data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}