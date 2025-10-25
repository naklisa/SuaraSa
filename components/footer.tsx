// components/footer.tsx
import Link from "next/link";
// Import untuk Link, Instagram, dan Github tidak lagi diperlukan karena sudah dihapus.

export default function Footer() {
  return (
    <footer className="border-t mt-auto text-xs text-muted-foreground">
      {/* Container diubah untuk menengahkan konten karena sekarang hanya ada satu elemen.
        'justify-between' diganti dengan 'justify-center'.
      */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
        {/* Brand */}
        <Link
          href="/"
          className="text-5xl text-white hover:opacity-90 transition mb-4"
          style={{ fontFamily: "var(--font-retrock)" }}
        >
          SuaraAsa
        </Link>
        {/* Bagian untuk ikon sosial media telah dihapus dari sini */}
      </div>
    </footer>
  );
}
