// components/footer.tsx

// Import untuk Link, Instagram, dan Github tidak lagi diperlukan karena sudah dihapus.

export default function Footer() {
  return (
    <footer className="border-t mt-auto py-6 text-xs text-muted-foreground">
      {/* Container diubah untuk menengahkan konten karena sekarang hanya ada satu elemen.
        'justify-between' diganti dengan 'justify-center'.
      */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
        {/* Brand */}
        <p className="font-medium text-foreground/80 whitespace-nowrap">
          🎵 SuaraAsa © {new Date().getFullYear()}
        </p>

        {/* Bagian untuk ikon sosial media telah dihapus dari sini */}
      </div>
    </footer>
  )
}