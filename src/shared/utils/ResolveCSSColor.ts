export function resolveColor(color: string): string {
	if (typeof window === "undefined") return color; // SSR safe fallback

	return getComputedStyle(document.documentElement)
		.getPropertyValue(color)
		.trim();
}
