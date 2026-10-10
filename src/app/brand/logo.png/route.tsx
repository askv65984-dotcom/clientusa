import { ImageResponse } from "next/og";
import { BrandTile } from "@/lib/brand-image";

/** 512px square logo referenced from the Organization structured data. */
export async function GET() {
  return new ImageResponse(<BrandTile size={512} />, { width: 512, height: 512 });
}
