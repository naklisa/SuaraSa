// app/sign-in/page.tsx
"use client"

import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { FaSpotify } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import * as React from "react"

export default function SignInPage() {
  const [loadingProvider, setLoadingProvider] = React.useState<
    "spotify" | "google" | null
  >(null)

  const handleSignIn = async (provider: "spotify" | "google") => {
    try {
      setLoadingProvider(provider)
      toast.loading(
        provider === "spotify" ? "Opening Spotify..." : "Opening Google...",
      )
      // Use query flag so a success toast can show after redirect via ToastOnAuth
      await signIn(provider, { callbackUrl: "/?signedIn=1" })
    } catch {
      toast.dismiss()
      toast.error("Failed to start sign in. Please try again.")
      setLoadingProvider(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in with Spotify or Google to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              disabled={loadingProvider !== null}
              onClick={() => handleSignIn("spotify")}
              className="w-full h-12 gap-2 border-primary/30 hover:bg-primary/5"
            >
              <FaSpotify className="w-5 h-5 text-[#1DB954]" />
              {loadingProvider === "spotify"
                ? "Redirecting..."
                : "Continue with Spotify"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={loadingProvider !== null}
              onClick={() => handleSignIn("google")}
              className="w-full h-12 gap-2 border-primary/30 hover:bg-primary/5"
            >
              <FcGoogle className="w-5 h-5" />
              {loadingProvider === "google"
                ? "Redirecting..."
                : "Continue with Google"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
