import { createServerClient as createServerClientBase } from "@supabase/ssr"
import type { NextRequest, NextResponse } from "next/server"
import type { Database } from "@/types/supabase"

// Función para crear un cliente de Supabase para Route Handlers
export function createRouteClient(request: NextRequest, response: NextResponse) {
  return createServerClientBase<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          return request.cookies.get(name)?.value
        },
        set: (name, value, options) => {
          response.cookies.set({
            name,
            value,
            ...options,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          })
        },
        remove: (name, options) => {
          response.cookies.set({
            name,
            value: "",
            ...options,
            path: "/",
            maxAge: 0,
          })
        },
      },
    },
  )
}

