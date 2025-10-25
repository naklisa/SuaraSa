"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        // Ukuran dan orientasi
        "shrink-0 transition-all duration-500 ease-in-out",
        "data-[orientation=horizontal]:h-[2px] data-[orientation=horizontal]:w-full data-[orientation=horizontal]:rounded-lg",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[2px] data-[orientation=vertical]:rounded-lg",

        // Warna dan efek baru
        "bg-gradient-to-r from-[#5C83B3] via-[#37649D] to-[#134686]",
        "hover:from-[#134686] hover:via-[#37649D] hover:to-[#5C83B3]",
        "shadow-[0_0_6px_rgba(92,131,179,0.4)] hover:shadow-[0_0_10px_rgba(55,100,157,0.6)]",

        className
      )}
      {...props}
    />
  );
}

export { Separator };
