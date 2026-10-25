(function () {
  const PRODUCT = "plainly-brief";
  // Paste the Stripe Payment Link here when it exists. Do not reuse another product's link.
  const CHECKOUT_URL = "https://buy.stripe.com/bJe4gy4RGdhN4nL3l0gUM03";
  const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0evIc0gxlVEbYLk3uVmD
bOZ9M0VmppmtTMbxsHTMYTCyp8aiEWcnvBFgkJXd7s4eXRgRePc1QzLUZnyTBQpu
RDX+x4Z/RaexKjCu5fLhQ3xJ2Z2JTFOfGOqgK8mmj4AyUQwMdc3j4qYPgASPAiHZ
aAm9rn+uJ8SkdywoK8fZhtTCKmt45ORUz80yx2I8iVQPwe3s37XGNXKlafROVgqZ
3pE89nQ+rXryntBIjt0jHPEYM44VNHSilPB5kb5g7jSgNpw/+iupueop/4uPMsTA
rLoXAIVPmCKI8b4sDu3F3vBKd4xtw3Y6KCXZm7rYEoBPMys5//Gi2WbRUeVgKxx8
VQIDAQAB
-----END PUBLIC KEY-----`;

  function bytes(text) {
    let clean = text.replace(/-----[^-]+-----/g, "").replace(/\s/g, "");
    clean = clean.replace(/-/g, "+").replace(/_/g, "/");
    while (clean.length % 4) clean += "=";
    const binary = atob(clean);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
    return out;
  }

  async function verify(code) {
    try {
      const value = String(code || "").trim();
      const dot = value.indexOf(".");
      if (dot <= 0) return false;
      const body = value.slice(0, dot);
      const signature = value.slice(dot + 1);
      const key = await crypto.subtle.importKey(
        "spki",
        bytes(PUBLIC_KEY),
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["verify"],
      );
      const ok = await crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        key,
        bytes(signature),
        new TextEncoder().encode(body),
      );
      if (!ok) return false;
      const payload = JSON.parse(new TextDecoder().decode(bytes(body)));
      if (payload.p !== PRODUCT) return false;
      if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) return false;
      return true;
    } catch {
      return false;
    }
  }

  globalThis.PlainlyLicense = { product: PRODUCT, checkoutUrl: CHECKOUT_URL, verify };
})();
