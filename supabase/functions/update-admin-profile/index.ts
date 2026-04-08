import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Update admin profile
  const { data, error } = await supabase
    .from("profiles")
    .update({ role: "admin", full_name: "Admin" })
    .eq("email", "admin@bulkur.com")
    .select();

  // Also confirm the admin user's email
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", "admin@bulkur.com")
    .single();

  if (profiles?.id) {
    await supabase.auth.admin.updateUserById(profiles.id, {
      email_confirm: true,
      password: "12345678",
      user_metadata: { full_name: "Admin", role: "admin" },
    });
  }

  // Also confirm seller and buyer emails
  const { data: sellerProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", "seller@bulkur.com")
    .single();
  if (sellerProfile?.id) {
    await supabase.auth.admin.updateUserById(sellerProfile.id, { email_confirm: true });
  }

  const { data: buyerProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", "buyer@bulkur.com")
    .single();
  if (buyerProfile?.id) {
    await supabase.auth.admin.updateUserById(buyerProfile.id, { email_confirm: true });
  }

  return new Response(JSON.stringify({ data, error }), {
    headers: { "Content-Type": "application/json" },
  });
});
