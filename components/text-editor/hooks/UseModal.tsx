/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo, useState } from 'react';
import * as React from 'react';
import TextEditorModal from '../ui/Modal/Modal';

export default function TextEditorUseModal(): [
	JSX.Element | null,
	(title: string, showModal: (onClose: () => void) => JSX.Element) => void,
] {
	const [modalContent, setModalContent] = useState<null | {
		closeOnClickOutside: boolean;
		content: JSX.Element;
		title: string;
	}>(null);

	const onClose = useCallback(() => {
		setModalContent(null);
	}, []);

	const modal = useMemo(() => {
		if (modalContent === null) {
			return null;
		}
		const { title, content, closeOnClickOutside } = modalContent;
		return (
			<TextEditorModal
				onClose={onClose}
				title={title}
				closeOnClickOutside={closeOnClickOutside}
			>
				{content}
			</TextEditorModal>
		);
	}, [modalContent, onClose]);

	const showModal = useCallback(
		(
			title: any,
			getContent: (onClose: () => void) => JSX.Element,
			closeOnClickOutside = false
		) => {
			setModalContent({
				closeOnClickOutside,
				content: getContent(onClose),
				title,
			});
		},
		[onClose]
	);

	return [modal, showModal];
}
