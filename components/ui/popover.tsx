"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          // 🩵 Struktur dasar
          "z-50 w-72 rounded-2xl border shadow-xl p-4 backdrop-blur-md",
          // 🌈 Warna dan efek baru
          "bg-gradient-to-b from-[#EAF1FA]/95 via-[#D7E3F3]/90 to-[#F3F7FB]/90 text-[#134686]",
          "border-[#5C83B3]/30 shadow-[0_4px_15px_rgba(19,70,134,0.15)]",
          // 💫 Transisi animasi halus
          "transition-all duration-300 ease-out",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          // 📍 Animasi arah buka tutup
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          // ✨ Hover & highlight halus
          "hover:shadow-[0_6px_20px_rgba(92,131,179,0.3)]",
          "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-transparent before:to-white/5 before:pointer-events-none",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
