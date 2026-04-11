import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const data = req.body;

    const {
      amount,
      invoice_no,
      transaction_id,
      hashed
    } = data;

    // ⚠️ نفس الترتيب حسب التوثيق
    const raw = invoice_no + transaction_id + amount;

    const expectedHash = crypto
      .createHmac("sha256", process.env.SECRET_KEY)
      .update(raw)
      .digest("hex");

    if (expectedHash !== hashed) {
      console.log("❌ Hash غير صحيح");
      return res.status(400).send("Invalid hash");
    }

    console.log("✅ الدفع صحيح:", data);

    // هنا تقدر:
    // - تخزن العملية
    // - تفعل اشتراك
    // - تسلم المنتج

    res.status(200).send("OK");

  } catch (err) {
    res.status(500).send("Error");
  }
}