export default async function handler(req, res) {
  try {
    const { process_id, code, amount } = req.body;
    
    // Determine the provider based on the type of ID or a hint. 
    // In Plutu, Sadad usually returns transaction_id while Adfali returns process_id.
    // To keep it simple, we'll try to find which service it belongs to or use a standard confirm if possible.
    // Here we'll default to edfali but mention the endpoint.
    
    // Consistent with documentation, Sadad confirmation uses transaction/sadad/confirm
    // Adfali uses transaction/edfali/confirm
    // We can use a simple check or have the frontend pass the provider.
    // For now, let's assume if it came from the sadad flow in UI, we check the length or metadata.
    
    let endpoint = "https://api.plutus.ly/api/v1/transaction/edfali/confirm";
    
    // In our index.html logic, Sadad returns a 6-digit code usually.
    // We'll try to refine this logic. 
    // For production, it's better to pass the 'method' in req.body
    const method = req.body.method || 'edfali';
    if (method === 'sadad') {
       endpoint = "https://api.plutus.ly/api/v1/transaction/sadad/confirm";
    }

    const response = await fetch(endpoint, {
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
    console.log(`${method.toUpperCase()} CONFIRM:`, data);

    if (data.status === 200) {
      return res.json({ status: 200, message: "✅ تم الدفع بنجاح", data });
    }

    res.status(response.status || 400).json({ status: response.status || 400, message: "❌ فشل الدفع", data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}