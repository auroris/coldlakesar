export async function onRequestPost(context) {
  const formData = await context.request.formData();
  const email = formData.get("email");
  const message = formData.get("message");

  // Call your email API
  await fetch("https://api.example.com/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, message }),
  });

  return Response.redirect("https://your-site.pages.dev/thank-you", 303);
}