import { atomWithStorage } from 'jotai/utils';
import type { StarknetWindowObject } from 'starknetkit';

export const walletStarknetkitLatestAtom = atomWithStorage<
	undefined | null | StarknetWindowObject
>('walletStarknetkitLatest', undefined);