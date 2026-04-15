export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { phone, amount } = req.body;

    const response = await fetch("https://api.plutus.ly/api/v1/transaction/edfali/verify", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.API_KEY,
        "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`
      },
      body: new URLSearchParams({
        mobile_number: phone,
        amount: amount || "10"
      })
      
    });

    const data = await response.json();

    console.log("VERIFY:", data);

    res.status(response.status).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}