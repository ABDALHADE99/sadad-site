export default async function handler(req, res) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "رقم الهاتف مطلوب" });
    }

    const response = await fetch("https://api.plutu.ly/api/v1/payment/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api_key": process.env.API_KEY,
        "access_token": process.env.ACCESS_TOKEN
      },
      body: JSON.stringify({
        phone: phone,
        amount: 10,
        currency: "LYD",
        service_id: 1,
        callback_url: "https://project-414yp.vercel.app/api/callback"
      })
    });

    const data = await response.json();

    console.log("VERIFY RESPONSE:", data); // 🔥 مهم جدًا

    res.status(response.status).json(data);

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
}
