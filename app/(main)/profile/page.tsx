// app/profile/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Music2, Star, Calendar } from "lucide-react"
import ProfileReviews from "@/components/profile/profile-reviews"

// ---- Types ----
type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

type TrackLite = {
  id: string
  name: string
  artists: string[]
  album: string
  albumImage: string | null
}

type ReviewWithTrack = {
  id: string
  rating: number
  title: string | null
  body: string
  createdAt: Date
  updatedAt: Date
  authorId: string
  trackId: string
  track: TrackLite
}

// Minimal, server-safe star display
function Stars({ value }: { value: number }) {
  const full = Math.round(value)
  return (
    <span
      aria-label={`${value.toFixed(1)} out of 5 stars`}
      className="inline-flex items-center gap-1 text-yellow-500"
    >
      {"★".repeat(full)}
      <span className="text-muted-foreground">
        {"★".repeat(Math.max(0, 5 - full))}
      </span>
    </span>
  )
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  const user = session?.user as SessionUser | undefined

  if (!user?.id) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center space-y-4">
        <h1 className="text-2xl font-semibold">Your profile</h1>
        <p className="text-muted-foreground">
          Sign in to view your reviews and favorites.
        </p>
        <Link
          href="/sign-in"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition"
        >
          Sign in
        </Link>
      </div>
    )
  }

  const [agg, myReviews, favs] = await Promise.all([
    prisma.review.aggregate({
      where: { authorId: user.id },
      _avg: { rating: true },
      _count: true,
    }),
    prisma.review.findMany({
      where: { authorId: user.id },
      include: {
        track: {
          select: {
            id: true,
            name: true,
            artists: true,
            album: true,
            albumImage: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }) as unknown as Promise<ReviewWithTrack[]>,
    prisma.review.findMany({
      where: { authorId: user.id, rating: 5 },
      include: {
        track: {
          select: {
            id: true,
            name: true,
            artists: true,
            album: true,
            albumImage: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    }) as unknown as Promise<ReviewWithTrack[]>,
  ])

  const avgGiven = agg._avg.rating ?? 0
  const totalReviews = agg._count

  // Serialize dates for the client component
  const reviewsForClient = myReviews.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }))

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      {/* Header */}
      <header className="rounded-2xl border bg-card/50 p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "User"}
                width={64}
                height={64}
                loading="lazy"
                className="rounded-full border object-cover"
              />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-semibold">
                {(user.name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold truncate">
                {user.name ?? "User"}
              </h1>
              {user.email && (
                <p className="text-sm text-muted-foreground truncate">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="rounded-xl border p-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Total</span>
                <Music2 className="w-4 h-4" />
              </div>
              <div className="mt-1 text-xl font-semibold tabular-nums">
                {totalReviews}
              </div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Avg</span>
                <Star className="w-4 h-4" />
              </div>
              <div className="mt-1 flex items-center gap-1 text-xl font-semibold">
                {avgGiven.toFixed(1)}
                <span className="hidden sm:inline"> {/* Only show stars on sm+ */}
                  <Stars value={avgGiven} />
                </span>
              </div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>5★</span>
                <Heart className="w-4 h-4" />
              </div>
              <div className="mt-1 text-xl font-semibold tabular-nums">
                {favs.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Favorites */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Favorites</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Tracks you rated 5★
          </p>
        </div>

        {favs.length === 0 ? (
          <Card className="border-muted">
            <CardContent className="p-6 text-sm text-muted-foreground text-center">
              You don’t have any 5★ favorites yet.
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Mobile: horizontal scroll */}
            <div className="md:hidden -mx-4 px-4">
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar">
                {favs.map((r) => {
                  const t = r.track
                  return (
                    <Link
                      key={r.id}
                      href={`/track/${t?.id ?? r.trackId}`}
                      className="group min-w-[78%] snap-start block rounded-2xl border hover:border-primary/40 transition-all duration-200 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden border shrink-0">
                          {t?.albumImage ? (
                            <Image
                              src={t.albumImage}
                              alt={t.name}
                              width={56}
                              height={56}
                              loading="lazy"
                              className="rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate group-hover:text-primary transition-colors">
                            {t?.name ?? "Unknown"}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {(t?.artists ?? []).join(", ")}
                            {t?.album ? ` — ${t.album}` : ""}
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
              {favs.map((r) => {
                const t = r.track
                return (
                  <Link
                    key={r.id}
                    href={`/track/${t?.id ?? r.trackId}`}
                    className="group block rounded-2xl border border-border/40 hover:border-primary/40 hover:shadow-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border">
                        {t?.albumImage ? (
                          <Image
                            src={t.albumImage}
                            alt={t.name}
                            width={56}
                            height={56}
                            loading="lazy"
                            className="rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate group-hover:text-primary transition-colors">
                          {t?.name ?? "Unknown"}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {(t?.artists ?? []).join(", ")}
                          {t?.album ? ` — ${t.album}` : ""}
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </section>

      {/* Divider */}
      <div className="h-px bg-border/80" />

      {/* Reviews */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your reviews</h2>
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Sorted by most recent
          </div>
        </div>

        <ProfileReviews initialItems={reviewsForClient} />
      </section>
    </div>
  )
}
