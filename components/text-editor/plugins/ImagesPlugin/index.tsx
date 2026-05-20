import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import {
	$createImageNode,
	$isImageNode,
	ImageNode,
	TextEditorImagePayload,
} from 'components/text-editor/nodes';
import { TextEditorDialogActions } from 'components/text-editor/ui';
import TextEditorButton from 'components/text-editor/ui/Button/Button';
import TextEditorFileInput from 'components/text-editor/ui/Input/FileInput';
import TextEditorTextInput from 'components/text-editor/ui/Input/TextInput';
import {
	$createParagraphNode,
	$createRangeSelection,
	$getSelection,
	$insertNodes,
	$isNodeSelection,
	$isRootOrShadowRoot,
	$setSelection,
	COMMAND_PRIORITY_EDITOR,
	COMMAND_PRIORITY_HIGH,
	COMMAND_PRIORITY_LOW,
	createCommand,
	DRAGOVER_COMMAND,
	DRAGSTART_COMMAND,
	DROP_COMMAND,
	LexicalCommand,
	LexicalEditor,
} from 'lexical';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';

export type InsertImagePayload = Readonly<TextEditorImagePayload>;

const TRANSPARENT_IMAGE =
	'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export const CAN_USE_DOM: boolean =
	typeof window !== 'undefined' &&
	typeof window.document !== 'undefined' &&
	typeof window.document.createElement !== 'undefined';

const getDOMSelection = (targetWindow: Window | null): Selection | null =>
	CAN_USE_DOM ? (targetWindow || window).getSelection() : null;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
	createCommand('INSERT_IMAGE_COMMAND');

export function InsertImageUriDialogBody({
	onClick,
}: {
	onClick: (payload: InsertImagePayload) => void;
}): JSX.Element {
	const [src, setSrc] = useState('');
	const [altText, setAltText] = useState('');

	const isDisabled = src === '';

	return (
		<>
			<TextEditorTextInput
				label="Image URL"
				placeholder="i.e. https://source.unsplash.com/random"
				onChange={setSrc}
				value={src}
				data-test-id="image-modal-url-input"
			/>
			<TextEditorTextInput
				label="Alt Text"
				placeholder="Random unsplash image"
				onChange={setAltText}
				value={altText}
				data-test-id="image-modal-alt-text-input"
			/>
			<TextEditorDialogActions>
				<TextEditorButton
					data-test-id="image-modal-confirm-btn"
					disabled={isDisabled}
					onClick={() => onClick({ altText, src })}
				>
					Confirm
				</TextEditorButton>
			</TextEditorDialogActions>
		</>
	);
}

export function InsertImageUploadedDialogBody({
	onClick,
}: {
	onClick: (payload: InsertImagePayload) => void;
}): JSX.Element {
	const [src, setSrc] = useState('');
	const [altText, setAltText] = useState('');
	const [width, setWidth] = useState<number | undefined>(undefined);
	const [height, setHeight] = useState<number | undefined>(undefined);

	const isDisabled = !width || width <= 0 || !height || height <= 0;

	// Saves File image temporary
	const loadImage = async (files: FileList | null): Promise<void> => {
		if (!files) return;

		// Saves base64 as URL (just in case backend fails)
		const reader = new FileReader();
		reader.onload = function () {
			if (typeof reader.result === 'string') setSrc(reader.result);
		};
		reader.readAsDataURL(files[0]);
	};

	return (
		<>
			<TextEditorFileInput
				label="Image Upload"
				onChange={loadImage}
				accept="image/*"
				data-test-id="image-modal-file-upload"
			/>
			<TextEditorTextInput
				label="Alt Text"
				placeholder="Descriptive alternative text"
				onChange={setAltText}
				value={altText}
				data-test-id="image-modal-alt-text-input"
			/>
			<TextEditorTextInput
				label="Width"
				placeholder="Width"
				type="number"
				onChange={(value: string) => setWidth(parseInt(value))}
				value={width?.toLocaleString() ?? ''}
				data-test-id="image-modal-alt-text-input"
			/>
			<TextEditorTextInput
				label="Height"
				placeholder="Height"
				type="number"
				onChange={(value: string) => setHeight(parseInt(value))}
				value={height?.toLocaleString() ?? ''}
				data-test-id="image-modal-alt-text-input"
			/>
			<TextEditorDialogActions>
				<TextEditorButton
					data-test-id="image-modal-file-upload-btn"
					disabled={isDisabled}
					onClick={async () => {
						onClick({ altText, src, height, width });
					}}
				>
					Confirm
				</TextEditorButton>
			</TextEditorDialogActions>
		</>
	);
}

export function InsertImageDialog({
	activeEditor,
	onClose,
}: {
	activeEditor: LexicalEditor;
	onClose: () => void;
}): JSX.Element {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [mode, setMode] = useState<null | 'url' | 'file'>(null);
	const hasModifier = useRef(false);

	useEffect(() => {
		hasModifier.current = false;
		const handler = (e: KeyboardEvent): void => {
			hasModifier.current = e.altKey;
		};
		document.addEventListener('keydown', handler);
		return () => {
			document.removeEventListener('keydown', handler);
		};
	}, [activeEditor]);

	const onClick = (payload: InsertImagePayload): void => {
		activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
		onClose();
	};

	return (
		<>
			{/*!mode && (
        <TextEditorDialogButtonsList>
          <TextEditorButton
            data-test-id="image-modal-option-sample"
            onClick={() =>
              onClick(
                hasModifier.current
                  ? {
                      altText: 'Daylight fir trees forest glacier green high ice landscape',
                      src: '../images/landscape.jpg',
                    }
                  : {
                      altText: 'Yellow flower in tilt shift lens',
                      src: '../images/yellow-flower.jpg',
                    }
              )
            }
          >
            Sample
          </TextEditorButton>
          <TextEditorButton data-test-id="image-modal-option-url" onClick={() => setMode('url')}>
            URL
          </TextEditorButton>
          <TextEditorButton data-test-id="image-modal-option-file" onClick={() => setMode('file')}>
            File
          </TextEditorButton>
        </TextEditorDialogButtonsList>
          )*/}
			{/*mode === 'url' && <InsertImageUriDialogBody onClick={onClick} />*/}
			{
				/*mode === 'file' &&*/ <InsertImageUploadedDialogBody
					onClick={onClick}
				/>
			}
		</>
	);
}

export default function ImagesPlugin({
	captionsEnabled,
	maxWidth,
}: {
	captionsEnabled?: boolean;
	maxWidth?: number;
}): JSX.Element | null {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		if (!editor.hasNodes([ImageNode])) {
			throw new Error('ImagesPlugin: ImageNode not registered on editor');
		}

		return mergeRegister(
			editor.registerCommand<InsertImagePayload>(
				INSERT_IMAGE_COMMAND,
				(payload) => {
					const imageNode = $createImageNode({
						...payload,
						maxWidth: maxWidth,
					});
					$insertNodes([imageNode]);
					if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
						$wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
					}

					return true;
				},
				COMMAND_PRIORITY_EDITOR
			),
			editor.registerCommand<DragEvent>(
				DRAGSTART_COMMAND,
				(event) => {
					return onDragStart(event);
				},
				COMMAND_PRIORITY_HIGH
			),
			editor.registerCommand<DragEvent>(
				DRAGOVER_COMMAND,
				(event) => {
					return onDragover(event);
				},
				COMMAND_PRIORITY_LOW
			),
			editor.registerCommand<DragEvent>(
				DROP_COMMAND,
				(event) => {
					return onDrop(event, editor);
				},
				COMMAND_PRIORITY_HIGH
			)
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [captionsEnabled, editor]);

	return null;
}

function onDragStart(event: DragEvent): boolean {
	const img = window.document.createElement('img');
	img.src = TRANSPARENT_IMAGE;

	const node = getImageNodeInSelection();
	if (!node) {
		return false;
	}
	const dataTransfer = event.dataTransfer;
	if (!dataTransfer) {
		return false;
	}
	dataTransfer.setData('text/plain', '_');
	dataTransfer.setDragImage(img, 0, 0);
	dataTransfer.setData(
		'application/x-lexical-drag',
		JSON.stringify({
			data: {
				altText: node.__altText,
				caption: node.__caption,
				height: node.__height,
				key: node.getKey(),
				maxWidth: node.__maxWidth,
				showCaption: node.__showCaption,
				src: node.__src,
				width: node.__width,
			},
			type: 'image',
		})
	);

	return true;
}

function onDragover(event: DragEvent): boolean {
	const node = getImageNodeInSelection();
	if (!node) {
		return false;
	}
	if (!canDropImage(event)) {
		event.preventDefault();
	}
	return true;
}

function onDrop(event: DragEvent, editor: LexicalEditor): boolean {
	const node = getImageNodeInSelection();
	if (!node) {
		return false;
	}
	const data = getDragImageData(event);
	if (!data) {
		return false;
	}
	event.preventDefault();
	if (canDropImage(event)) {
		const range = getDragSelection(event);
		node.remove();
		const rangeSelection = $createRangeSelection();
		if (range !== null && range !== undefined) {
			rangeSelection.applyDOMRange(range);
		}
		$setSelection(rangeSelection);
		editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
	}
	return true;
}

function getImageNodeInSelection(): ImageNode | null {
	const selection = $getSelection();
	if (!$isNodeSelection(selection)) {
		return null;
	}
	const nodes = selection.getNodes();
	const node = nodes[0];
	return $isImageNode(node) ? node : null;
}

function getDragImageData(event: DragEvent): null | InsertImagePayload {
	const dragData = event.dataTransfer?.getData('application/x-lexical-drag');
	if (!dragData) {
		return null;
	}
	const { type, data } = JSON.parse(dragData);
	if (type !== 'image') {
		return null;
	}

	return data;
}

declare global {
	interface DragEvent {
		rangeOffset?: number;
		rangeParent?: Node;
	}
}

function canDropImage(event: DragEvent): boolean {
	const target = event.target;
	return !!(
		target &&
		target instanceof HTMLElement &&
		!target.closest('code, span.editor-image') &&
		target.parentElement &&
		target.parentElement.closest('div.ContentEditable__root')
	);
}

function getDragSelection(event: DragEvent): Range | null | undefined {
	let range;
	const target = event.target as null | Element | Document;
	const targetWindow =
		target == null
			? null
			: target.nodeType === 9
				? (target as Document).defaultView
				: (target as Element).ownerDocument.defaultView;
	const domSelection = getDOMSelection(targetWindow);
	if (document.caretRangeFromPoint) {
		range = document.caretRangeFromPoint(event.clientX, event.clientY);
	} else if (event.rangeParent && domSelection !== null) {
		domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
		range = domSelection.getRangeAt(0);
	} else {
		throw Error(`Cannot get the selection when dragging`);
	}

	return range;
}
