export default async function handler(req, res) {
  try {
    const { phone } = req.body;

    const response = await fetch("https://api.plutu.ly/api/v1/payment/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api_key": process.env.API_KEY,
        "access_token": process.env.ACCESS_TOKEN
      },
      body: JSON.stringify({
        phone: phone,
        amount: 10, // غيرها حسب السعر
        currency: "LYD",
        callback_url: "https://project-414yp.vercel.app/api/callback"
      })
    });

    const data = await response.json();

    if (!data.process_id) {
      return res.status(400).json({ message: "فشل إرسال OTP", data });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
}
