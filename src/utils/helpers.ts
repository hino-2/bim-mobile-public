import { memo, PropsWithChildren } from "react";
import { AttributeTypes } from "../store/attributes/types";
import { LoadingState } from "../store/types";

export const isChipDeleteIcon = (elem: Element) => {
	return (
		elem.classList.contains("MuiChip-deleteIcon") ||
		elem.parentElement?.classList.contains("MuiChip-deleteIcon")
	);
};

export const componentLoadingState = (...subComponentsStates: LoadingState[]): LoadingState => {
	for (const state of subComponentsStates) {
		if (state === LoadingState.Loading) return LoadingState.Loading;
		if (state === LoadingState.Reject) return LoadingState.Reject;
	}

	const allIdle = subComponentsStates.every((state) => state === LoadingState.Idle);

	if (allIdle) {
		return LoadingState.Idle;
	} else {
		return LoadingState.Resolve;
	}
};

export const getFreeSolo = (attributeType: AttributeTypes) => {
	if (attributeType === AttributeTypes.Boolean) {
		return false;
	}
	return true;
};

export const canLoadMoreData = (
	isLoading: boolean,
	{
		currentTarget: { clientHeight, scrollTop, scrollHeight },
	}: React.UIEvent<HTMLDivElement, UIEvent>,
	lazyOffset = 50,
	page: number,
	totalPages: number
) => !isLoading && page <= totalPages && clientHeight + scrollTop > scrollHeight - lazyOffset;

export const memoWithGenericTypes: <T>(
	c: T,
	areEqual?: (
		prevProps: Readonly<PropsWithChildren<T>>,
		nextProps: Readonly<PropsWithChildren<T>>
	) => boolean
) => T = memo;

export const logger = (error: unknown) => console.log(error);
