import { type RefObject, useEffect, useRef } from "react";
import type { ListMode } from "@/shared/types/ListMode";

type Params = {
	listMode: ListMode;
	isFetchingNextPage: boolean;
	onLoadMore: () => void;
	hasNextPage?: boolean;
	enabled?: boolean;
	rootMargin?: string;
	rootRef?: RefObject<Element | null>;
};

export const useInfiniteScrollSentinel = ({
	listMode,
	isFetchingNextPage,
	onLoadMore,
	hasNextPage,
	enabled = true,
	rootMargin = "200px",
	rootRef,
}: Params) => {
	const sentinelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!enabled || listMode !== "infiniteScroll") {
			return;
		}

		const sentinel = sentinelRef.current;

		if (!sentinel) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
					onLoadMore();
				}
			},
			{ root: rootRef?.current ?? null, rootMargin },
		);

		observer.observe(sentinel);

		return () => {
			observer.disconnect();
		};
	}, [
		enabled,
		hasNextPage,
		isFetchingNextPage,
		listMode,
		onLoadMore,
		rootMargin,
		rootRef,
	]);

	return sentinelRef;
};
