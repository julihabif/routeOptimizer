export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "",
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  cookieOptions: {
    // Add cookie options
    sbSameSite: "lax",
    sbSecure: process.env.NODE_ENV === "production",
    sbDomain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined, // Replace with your domain
    sbPath: "/",
  },
}

export function validateSupabaseConfig() {
  if (!supabaseConfig.url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL o SUPABASE_URL no está definido")
  }
  if (!supabaseConfig.anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY o SUPABASE_ANON_KEY no está definido")
  }
  return true
}
