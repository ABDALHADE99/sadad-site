export default async function handler(req, res) {
  try {
    const { process_id, code } = req.body;

    const response = await fetch("https://api.plutu.ly/api/v1/payment/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api_key": process.env.API_KEY,
        "access_token": process.env.ACCESS_TOKEN
      },
      body: JSON.stringify({
        process_id,
        code
      })
    });

    const data = await response.json();

    if (data.status === "success") {
      return res.json({ status: "success", message: "تم الدفع بنجاح" });
    }

    res.json({ status: "fail", message: "فشل الدفع", data });

  } catch (err) {
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
}