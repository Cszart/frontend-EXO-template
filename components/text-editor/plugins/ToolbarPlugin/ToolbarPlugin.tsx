/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// React Related
import {
	useCallback,
	Dispatch,
	useState,
	useEffect,
	SetStateAction,
} from 'react';

// Lexical
import {
	ElementFormatType,
	LexicalEditor,
	$getSelection,
	$createParagraphNode,
	$isRangeSelection,
	FORMAT_ELEMENT_COMMAND,
	OUTDENT_CONTENT_COMMAND,
	INDENT_CONTENT_COMMAND,
	NodeKey,
	$isRootOrShadowRoot,
	$isElementNode,
	$isTextNode,
	$getNodeByKey,
	SELECTION_CHANGE_COMMAND,
	COMMAND_PRIORITY_CRITICAL,
	CAN_UNDO_COMMAND,
	CAN_REDO_COMMAND,
	KEY_MODIFIER_COMMAND,
	COMMAND_PRIORITY_NORMAL,
	UNDO_COMMAND,
	REDO_COMMAND,
	FORMAT_TEXT_COMMAND,
} from 'lexical';

import {
	$createCodeNode,
	$isCodeNode,
	CODE_LANGUAGE_FRIENDLY_NAME_MAP,
	CODE_LANGUAGE_MAP,
	getLanguageFriendlyName,
} from '@lexical/code';
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
	INSERT_UNORDERED_LIST_COMMAND,
	REMOVE_LIST_COMMAND,
	INSERT_CHECK_LIST_COMMAND,
	INSERT_ORDERED_LIST_COMMAND,
	$isListNode,
	ListNode,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
	HeadingTagType,
	$createHeadingNode,
	$createQuoteNode,
	$isHeadingNode,
	$isQuoteNode,
} from '@lexical/rich-text';
import {
	$setBlocksType,
	$patchStyleText,
	$isParentElementRTL,
	$getSelectionStyleValueForProperty,
} from '@lexical/selection';
import { $isTableNode } from '@lexical/table';
import {
	$getNearestNodeOfType,
	$getNearestBlockElementAncestorOrThrow,
	mergeRegister,
	$findMatchingParent,
} from '@lexical/utils';

// Text Editor UI
import { TextEditorDropDownItem } from 'components/text-editor/ui';
import TextEditorDropDown from 'components/text-editor/ui/Dropdown/DropDown';
import TextEditorDropdownColorPicker from 'components/text-editor/ui/DropdownColorPicker/DropdownColorPicker';
import { getSelectedNode, sanitizeUrl } from 'components/text-editor/utils';

// Other
import FontSize from './fontSize';
import { InsertImageDialog } from '../ImagesPlugin';
import TextEditorUseModal from '../../hooks/UseModal';

// --- --- UTILS CONST --- --- //
// Usually options for the toolbar

const rootTypeToRootName = {
	root: 'Root',
	table: 'Table',
};

export const blockTypeToBlockName: { [key: string]: string } = {
	bullet: 'Bulleted List',
	check: 'Check List',
	code: 'Code Block',
	h1: 'Heading 1',
	h2: 'Heading 2',
	h3: 'Heading 3',
	h4: 'Heading 4',
	h5: 'Heading 5',
	h6: 'Heading 6',
	number: 'Numbered List',
	paragraph: 'Normal',
	quote: 'Quote',
	ol: 'Numbered List',
	ul: 'Bulleted List',
};

const FONT_FAMILY_OPTIONS: [string, string][] = [
	['Arial', 'Arial'],
	['Courier New', 'Courier New'],
	['Georgia', 'Georgia'],
	['Times New Roman', 'Times New Roman'],
	['Trebuchet MS', 'Trebuchet MS'],
	['Verdana', 'Verdana'],
];

const FONT_SIZE_OPTIONS: [string, string][] = [
	['10px', '10px'],
	['11px', '11px'],
	['12px', '12px'],
	['13px', '13px'],
	['14px', '14px'],
	['15px', '15px'],
	['16px', '16px'],
	['17px', '17px'],
	['18px', '18px'],
	['19px', '19px'],
	['20px', '20px'],
];

const ELEMENT_FORMAT_OPTIONS: {
	[key in Exclude<ElementFormatType, ''>]: {
		icon: string;
		iconRTL: string;
		name: string;
	};
} = {
	center: {
		icon: 'center-align',
		iconRTL: 'center-align',
		name: 'Center Align',
	},
	end: {
		icon: 'right-align',
		iconRTL: 'left-align',
		name: 'End Align',
	},
	justify: {
		icon: 'justify-align',
		iconRTL: 'justify-align',
		name: 'Justify Align',
	},
	left: {
		icon: 'left-align',
		iconRTL: 'left-align',
		name: 'Left Align',
	},
	right: {
		icon: 'right-align',
		iconRTL: 'left-align',
		name: 'Right Align',
	},
	start: {
		icon: 'left-align',
		iconRTL: 'right-align',
		name: 'Start Align',
	},
};

// --- --- ELEMENTS FUNCTIONS helpers --- --- //
function dropDownActiveClass(active: boolean): string {
	if (active) return 'active dropdown-item-active';
	else return '';
}

function getCodeLanguageOptions(): [string, string][] {
	const options: [string, string][] = [];

	for (const [lang, friendlyName] of Object.entries(
		CODE_LANGUAGE_FRIENDLY_NAME_MAP
	)) {
		options.push([lang, friendlyName]);
	}

	return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

// --- --- OPTION TOOLBAR ELEMENTS --- --- //
// These elements are going to be rendered

// DIVIDER element
function Divider(): JSX.Element {
	return <div className="divider" />;
}
// EDITOR block options
function BlockFormatDropDown({
	editor,
	blockType,
	rootType,
	disabled = false,
}: {
	blockType: keyof typeof blockTypeToBlockName;
	rootType: keyof typeof rootTypeToRootName;
	editor: LexicalEditor;
	disabled?: boolean;
}): JSX.Element {
	const formatParagraph = (): void => {
		editor.update(() => {
			const selection = $getSelection();
			$setBlocksType(selection as any, () => $createParagraphNode());
		});
	};

	const formatHeading = (headingSize: HeadingTagType): void => {
		if (blockType !== headingSize) {
			editor.update(() => {
				const selection = $getSelection();
				$setBlocksType(selection as any, () => $createHeadingNode(headingSize));
			});
		}
	};

	const formatBulletList = (): void => {
		if (blockType !== 'bullet') {
			editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const formatCheckList = (): void => {
		if (blockType !== 'check') {
			editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const formatNumberedList = (): void => {
		if (blockType !== 'number') {
			editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const formatQuote = (): void => {
		if (blockType !== 'quote') {
			editor.update(() => {
				const selection = $getSelection();
				$setBlocksType(selection as any, () => $createQuoteNode());
			});
		}
	};

	const formatCode = (): void => {
		if (blockType !== 'code') {
			editor.update(() => {
				let selection = $getSelection();

				if (selection !== null) {
					if ((selection as any).isCollapsed()) {
						$setBlocksType(selection as any, () => $createCodeNode());
					} else {
						const textContent = selection.getTextContent();
						const codeNode = $createCodeNode();
						selection.insertNodes([codeNode]);
						selection = $getSelection();
						if ($isRangeSelection(selection))
							selection.insertRawText(textContent);
					}
				}
			});
		}
	};

	return (
		<TextEditorDropDown
			disabled={disabled}
			buttonClassName="toolbar-item block-controls"
			buttonIconClassName={'icon block-type ' + blockType}
			buttonIconName="block-type"
			buttonLabel={blockTypeToBlockName[blockType]}
			buttonAriaLabel="Formatting options for text style"
		>
			<TextEditorDropDownItem
				className={'item ' + dropDownActiveClass(blockType === 'paragraph')}
				onClick={formatParagraph}
			>
				<i className="icon paragraph" />
				<span className="text">Normal</span>
			</TextEditorDropDownItem>
			<TextEditorDropDownItem
				className={'item ' + dropDownActiveClass(blockType === 'h1')}
				onClick={() => formatHeading('h1')}
			>
				<i className="icon h1" />
				<span className="text">Heading 1</span>
			</TextEditorDropDownItem>
			<TextEditorDropDownItem
				className={'item ' + dropDownActiveClass(blockType === 'h2')}
				onClick={() => formatHeading('h2')}
			>
				<i className="icon h2" />
				<span className="text">Heading 2</span>
			</TextEditorDropDownItem>
			<TextEditorDropDownItem
				className={'item ' + dropDownActiveClass(blockType === 'h3')}
				onClick={() => formatHeading('h3')}
			>
				<i className="icon h3" />
				<span className="text">Heading 3</span>
			</TextEditorDropDownItem>
			{/* <TextEditorDropDownItem
				className={'item ' + dropDownActiveClass(blockType === 'bullet')}
				onClick={formatBulletList}
			>
				<i className="icon bullet-list" />
				<span className="text">Bullet List</span>
			</TextEditorDropDownItem>
			<TextEditorDropDownItem
				className={'item ' + dropDownActiveClass(blockType === 'number')}
				onClick={formatNumberedList}
			>
				<i className="icon numbered-list" />
				<span className="text">Numbered List</span>
			</TextEditorDropDownItem>
			<TextEditorDropDownItem
				className={'item ' + dropDownActiveClass(blockType === 'check')}
				onClick={formatCheckList}
			>
				<i className="icon check-list" />
				<span className="text">Check List</span>
			</TextEditorDropDownItem> */}
			<TextEditorDropDownItem
				className={'item ' + dropDownActiveClass(blockType === 'quote')}
				onClick={formatQuote}
			>
				<i className="icon quote" />
				<span className="text">Quote</span>
			</TextEditorDropDownItem>
			<TextEditorDropDownItem
				className={'item ' + dropDownActiveClass(blockType === 'code')}
				onClick={formatCode}
			>
				<i className="icon code" />
				<span className="text">Code Block</span>
			</TextEditorDropDownItem>
		</TextEditorDropDown>
	);
}

// FONT options
function FontDropDown({
	editor,
	value,
	style,
	disabled = false,
}: {
	editor: LexicalEditor;
	value: string;
	style: string;
	disabled?: boolean;
}): JSX.Element {
	const handleClick = useCallback(
		(option: string) => {
			editor.update(() => {
				const selection = $getSelection();
				if (selection !== null) {
					$patchStyleText(selection as any, {
						[style]: option,
					});
				}
			});
		},
		[editor, style]
	);

	const buttonAriaLabel =
		style === 'font-family'
			? 'Formatting options for font family'
			: 'Formatting options for font size';

	return (
		<TextEditorDropDown
			disabled={disabled}
			buttonClassName={'toolbar-item ' + style}
			buttonLabel={value}
			buttonIconClassName={
				style === 'font-family' ? 'icon block-type font-family' : ''
			}
			buttonIconName="font-family"
			buttonAriaLabel={buttonAriaLabel}
		>
			{(style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(
				([option, text]) => (
					<TextEditorDropDownItem
						className={`item ${dropDownActiveClass(value === option)} ${
							style === 'font-size' ? 'fontsize-item' : ''
						}`}
						onClick={() => handleClick(option)}
						key={option}
					>
						<span className="text">{text}</span>
					</TextEditorDropDownItem>
				)
			)}
		</TextEditorDropDown>
	);
}

// ALIGN options
function ElementFormatDropdown({
	editor,
	value,
	isRTL,
	disabled = false,
}: {
	editor: LexicalEditor;
	value: ElementFormatType;
	isRTL: boolean;
	disabled: boolean;
}): JSX.Element {
	const formatOption = ELEMENT_FORMAT_OPTIONS[value || 'left'];

	return (
		<TextEditorDropDown
			disabled={disabled}
			buttonLabel={formatOption.name}
			buttonIconClassName={'icon'}
			buttonIconName={isRTL ? formatOption.iconRTL : formatOption.icon}
			buttonClassName="toolbar-item spaced alignment"
			buttonAriaLabel="Formatting options for text alignment"
		>
			<TextEditorDropDownItem
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
				}}
				className="item"
			>
				<i className="icon left-align" />
				<span className="text">Left Align</span>
			</TextEditorDropDownItem>
			<TextEditorDropDownItem
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
				}}
				className="item"
			>
				<i className="icon center-align" />
				<span className="text">Center Align</span>
			</TextEditorDropDownItem>
			<TextEditorDropDownItem
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
				}}
				className="item"
			>
				<i className="icon right-align" />
				<span className="text">Right Align</span>
			</TextEditorDropDownItem>
			<TextEditorDropDownItem
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
				}}
				className="item"
			>
				<i className="icon justify-align" />
				<span className="text">Justify Align</span>
			</TextEditorDropDownItem>
			<TextEditorDropDownItem
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'start');
				}}
				className="item"
			>
				<i
					className={`icon ${
						isRTL
							? ELEMENT_FORMAT_OPTIONS.start.iconRTL
							: ELEMENT_FORMAT_OPTIONS.start.icon
					}`}
				/>
				<span className="text">Start Align</span>
			</TextEditorDropDownItem>
			<TextEditorDropDownItem
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'end');
				}}
				className="item"
			>
				<i
					className={`icon ${
						isRTL
							? ELEMENT_FORMAT_OPTIONS.end.iconRTL
							: ELEMENT_FORMAT_OPTIONS.end.icon
					}`}
				/>
				<span className="text">End Align</span>
			</TextEditorDropDownItem>
			<Divider />
			<TextEditorDropDownItem
				onClick={() => {
					editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
				}}
				className="item"
			>
				<i className={'icon ' + (isRTL ? 'indent' : 'outdent')} />
				<span className="text">Outdent</span>
			</TextEditorDropDownItem>
			<TextEditorDropDownItem
				onClick={() => {
					editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
				}}
				className="item"
			>
				<i className={'icon ' + (isRTL ? 'outdent' : 'indent')} />
				<span className="text">Indent</span>
			</TextEditorDropDownItem>
		</TextEditorDropDown>
	);
}

export default function ToolbarPlugin({
	blockType,
	setBlockType,
	setIsLinkEditMode,
}: {
	blockType: string | number;
	setBlockType: Dispatch<SetStateAction<string | number>>;
	setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element {
	// --- --- Util variables --- --- //
	const [editor] = useLexicalComposerContext();
	const [activeEditor, setActiveEditor] = useState(editor);
	const [modal, showModal] = TextEditorUseModal();

	const IS_APPLE = false;

	// --- --- Vars to keep track of options --- --- //
	const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
		null
	);

	const [rootType, setRootType] =
		useState<keyof typeof rootTypeToRootName>('root');
	const [fontSize, setFontSize] = useState<string>('15px');
	const [fontColor, setFontColor] = useState<string>('#000');
	const [bgColor, setBgColor] = useState<string>('#fff');
	const [fontFamily, setFontFamily] = useState<string>('Arial');
	const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
	const [codeLanguage, setCodeLanguage] = useState<string>('');

	// --- --- Flags to keep track of options --- --- //
	const [isLink, setIsLink] = useState(false);
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const [isStrikethrough, setIsStrikethrough] = useState(false);
	const [isSubscript, setIsSubscript] = useState(false);
	const [isSuperscript, setIsSuperscript] = useState(false);
	const [isCode, setIsCode] = useState(false);
	const [isRTL, setIsRTL] = useState(false);
	const [isEditable, setIsEditable] = useState(() => editor.isEditable());
	const [canUndo, setCanUndo] = useState(false);
	const [canRedo, setCanRedo] = useState(false);

	// --- --- Functions --- --- //
	// Main function to update the toolbar when the user interacts with it
	const $updateToolbar = useCallback(() => {
		// First get the selection and the corresponding node
		const selection = $getSelection();

		if ($isRangeSelection(selection)) {
			const anchorNode = selection.anchor.getNode();
			let element =
				anchorNode.getKey() === 'root'
					? anchorNode
					: $findMatchingParent(anchorNode, (e) => {
							const parent = e.getParent();
							return parent !== null && $isRootOrShadowRoot(parent);
					  });

			if (element === null) {
				element = anchorNode.getTopLevelElementOrThrow();
			}

			const elementKey = element.getKey();
			const elementDOM = activeEditor.getElementByKey(elementKey);

			// Update text format
			setIsBold(selection.hasFormat('bold'));
			setIsItalic(selection.hasFormat('italic'));
			setIsUnderline(selection.hasFormat('underline'));
			setIsStrikethrough(selection.hasFormat('strikethrough'));
			setIsSubscript(selection.hasFormat('subscript'));
			setIsSuperscript(selection.hasFormat('superscript'));
			setIsCode(selection.hasFormat('code'));
			setIsRTL($isParentElementRTL(selection));

			// Update links
			const node = getSelectedNode(selection);
			const parent = node.getParent();
			if ($isLinkNode(parent) || $isLinkNode(node)) {
				setIsLink(true);
			} else {
				setIsLink(false);
			}

			// Update table node if necessary
			const tableNode = $findMatchingParent(node, $isTableNode);
			if ($isTableNode(tableNode)) {
				setRootType('table');
			} else {
				setRootType('root');
			}

			if (elementDOM !== null) {
				setSelectedElementKey(elementKey);
				if ($isListNode(element)) {
					const parentList = $getNearestNodeOfType<ListNode>(
						anchorNode,
						ListNode
					);
					const type = parentList
						? parentList.getListType()
						: element.getListType();
					setBlockType(type);
				} else {
					const type = $isHeadingNode(element)
						? element.getTag()
						: element.getType();
					if (type in blockTypeToBlockName) {
						setBlockType(type as keyof typeof blockTypeToBlockName);
					}
					if ($isCodeNode(element)) {
						const language =
							element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
						setCodeLanguage(
							language ? CODE_LANGUAGE_MAP[language] || language : ''
						);
						return;
					}
				}
			}
			// Handle buttons
			setFontSize(
				$getSelectionStyleValueForProperty(selection, 'font-size', '15px')
			);
			setFontColor(
				$getSelectionStyleValueForProperty(selection, 'color', '#000')
			);
			setBgColor(
				$getSelectionStyleValueForProperty(
					selection,
					'background-color',
					'#fff'
				)
			);
			setFontFamily(
				$getSelectionStyleValueForProperty(selection, 'font-family', 'Arial')
			);
			let matchingParent;
			if ($isLinkNode(parent)) {
				// If node is a link, we need to fetch the parent paragraph node to set format
				matchingParent = $findMatchingParent(
					node,
					(parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
				);
			}

			// If matchingParent is a valid node, pass it's format type
			setElementFormat(
				$isElementNode(matchingParent)
					? matchingParent.getFormatType()
					: $isElementNode(node)
					? node.getFormatType()
					: parent?.getFormatType() || 'left'
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeEditor]);

	const applyStyleText = useCallback(
		(styles: Record<string, string>, skipHistoryStack?: boolean) => {
			activeEditor.update(
				() => {
					const selection = $getSelection();
					if (selection !== null) {
						$patchStyleText(selection as any, styles);
					}
				},
				skipHistoryStack ? { tag: 'historic' } : {}
			);
		},
		[activeEditor]
	);

	const clearFormatting = useCallback(() => {
		activeEditor.update(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				const anchor = selection.anchor;
				const focus = selection.focus;
				const nodes = selection.getNodes();

				if (anchor.key === focus.key && anchor.offset === focus.offset) {
					return;
				}

				nodes.forEach((node, idx) => {
					// We split the first and last node by the selection
					// So that we don't format unselected text inside those nodes
					if ($isTextNode(node)) {
						// Use a separate variable to ensure TS does not lose the refinement
						let textNode = node;
						if (idx === 0 && anchor.offset !== 0) {
							textNode = textNode.splitText(anchor.offset)[1] || textNode;
						}
						if (idx === nodes.length - 1) {
							textNode = textNode.splitText(focus.offset)[0] || textNode;
						}

						if (textNode.__style !== '') {
							textNode.setStyle('');
						}
						if (textNode.__format !== 0) {
							textNode.setFormat(0);
							$getNearestBlockElementAncestorOrThrow(textNode).setFormat('');
						}
						node = textNode;
					} else if ($isHeadingNode(node) || $isQuoteNode(node)) {
						node.replace($createParagraphNode(), true);
					} else if ($isDecoratorBlockNode(node)) {
						node.setFormat('');
					}
				});
			}
		});
	}, [activeEditor]);

	const onFontColorSelect = useCallback(
		(value: string, skipHistoryStack: boolean) => {
			applyStyleText({ color: value }, skipHistoryStack);
		},
		[applyStyleText]
	);

	const onBgColorSelect = useCallback(
		(value: string, skipHistoryStack: boolean) => {
			applyStyleText({ 'background-color': value }, skipHistoryStack);
		},
		[applyStyleText]
	);

	const insertLink = useCallback(() => {
		if (!isLink) {
			setIsLinkEditMode(true);
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
		} else {
			setIsLinkEditMode(false);
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		}
	}, [editor, isLink, setIsLinkEditMode]);

	const onCodeLanguageSelect = useCallback(
		(value: string) => {
			activeEditor.update(() => {
				if (selectedElementKey !== null) {
					const node = $getNodeByKey(selectedElementKey);
					if ($isCodeNode(node)) {
						node.setLanguage(value);
					}
				}
			});
		},
		[activeEditor, selectedElementKey]
	);

	useEffect(() => {
		return editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			(_payload, newEditor) => {
				$updateToolbar();
				setActiveEditor(newEditor);
				return false;
			},
			COMMAND_PRIORITY_CRITICAL
		);
	}, [editor, $updateToolbar]);

	useEffect(() => {
		return mergeRegister(
			editor.registerEditableListener((editable) => {
				setIsEditable(editable);
			}),
			activeEditor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					$updateToolbar();
				});
			}),
			activeEditor.registerCommand<boolean>(
				CAN_UNDO_COMMAND,
				(payload) => {
					setCanUndo(payload);
					return false;
				},
				COMMAND_PRIORITY_CRITICAL
			),
			activeEditor.registerCommand<boolean>(
				CAN_REDO_COMMAND,
				(payload) => {
					setCanRedo(payload);
					return false;
				},
				COMMAND_PRIORITY_CRITICAL
			)
		);
	}, [$updateToolbar, activeEditor, editor]);

	useEffect(() => {
		return activeEditor.registerCommand(
			KEY_MODIFIER_COMMAND,
			(payload) => {
				const event: KeyboardEvent = payload;
				const { code, ctrlKey, metaKey } = event;

				if (code === 'KeyK' && (ctrlKey || metaKey)) {
					event.preventDefault();
					let url: string | null;
					if (!isLink) {
						setIsLinkEditMode(true);
						url = sanitizeUrl('https://');
					} else {
						setIsLinkEditMode(false);
						url = null;
					}
					return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
				}
				return false;
			},
			COMMAND_PRIORITY_NORMAL
		);
	}, [activeEditor, isLink, setIsLinkEditMode]);

	return (
		<div className="lexical toolbar">
			{/* Action buttons */}
			{/* UNDO */}
			<button
				disabled={!canUndo || !isEditable}
				onClick={() => {
					activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
				}}
				title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
				type="button"
				className="toolbar-item spaced"
				aria-label="Undo"
			>
				<i className="format undo" />
			</button>

			{/* REDO */}
			<button
				disabled={!canRedo || !isEditable}
				onClick={() => {
					activeEditor.dispatchCommand(REDO_COMMAND, undefined);
				}}
				title={IS_APPLE ? 'Redo (⌘Y)' : 'Redo (Ctrl+Y)'}
				type="button"
				className="toolbar-item"
				aria-label="Redo"
			>
				<i className="format redo" />
			</button>
			<Divider />

			{/* EDITOR FORMATING - dropdown menu */}
			{/* This will be shown almost every time, it has multiple options to format text including code */}
			{blockType in blockTypeToBlockName && activeEditor === editor && (
				<>
					<BlockFormatDropDown
						disabled={!isEditable}
						blockType={blockType}
						rootType={rootType}
						editor={editor}
					/>
					<Divider />
				</>
			)}

			{/* CODE FORMAT - dropdown menu */}
			{/* This will be shown only when using editor in coding mode */}
			{blockType === 'code' && (
				<TextEditorDropDown
					disabled={!isEditable}
					buttonClassName="toolbar-item code-language"
					buttonLabel={getLanguageFriendlyName(codeLanguage)}
					buttonAriaLabel="Select language"
				>
					{CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
						return (
							<TextEditorDropDownItem
								className={`item ${dropDownActiveClass(
									value === codeLanguage
								)}`}
								onClick={() => onCodeLanguageSelect(value)}
								key={value}
							>
								<span className="text">{name}</span>
							</TextEditorDropDownItem>
						);
					})}
				</TextEditorDropDown>
			)}

			{/* Normal editor options, not coding mode */}
			{blockType !== 'code' && (
				<>
					{/* Font selection */}
					<FontDropDown
						disabled={!isEditable}
						style={'font-family'}
						value={fontFamily}
						editor={editor}
					/>
					<Divider />

					{/* Font size */}
					<FontSize
						selectionFontSize={fontSize.slice(0, -2)}
						editor={editor}
						disabled={!isEditable}
					/>
					<Divider />

					{/* Styling format options */}
					{/* Bold text */}
					<button
						disabled={!isEditable}
						onClick={() => {
							activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
						}}
						className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
						title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
						type="button"
						aria-label={`Format text as bold. Shortcut: ${
							IS_APPLE ? '⌘B' : 'Ctrl+B'
						}`}
					>
						<i className="format bold" />
					</button>

					{/* Italic text */}
					<button
						disabled={!isEditable}
						onClick={() => {
							activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
						}}
						className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
						title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
						type="button"
						aria-label={`Format text as italics. Shortcut: ${
							IS_APPLE ? '⌘I' : 'Ctrl+I'
						}`}
					>
						<i className="format italic" />
					</button>

					{/* Underline */}
					<button
						disabled={!isEditable}
						onClick={() => {
							activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
						}}
						className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
						title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
						type="button"
						aria-label={`Format text to underlined. Shortcut: ${
							IS_APPLE ? '⌘U' : 'Ctrl+U'
						}`}
					>
						<i className="format underline" />
					</button>

					{/* Code format */}
					{/* This is different from coding mode, this is to put some background and simple styling */}
					{/* coding mode is more usefull when it comes to writing real code */}
					<button
						disabled={!isEditable}
						onClick={() => {
							activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
						}}
						className={'toolbar-item spaced ' + (isCode ? 'active' : '')}
						title="Insert code block"
						type="button"
						aria-label="Insert code block"
					>
						<i className="format code" />
					</button>

					{/* Link text */}
					{/* For this you have two options, click and it will select automatically last word */}
					{/* or select the link and click the button */}
					<button
						disabled={!isEditable}
						onClick={insertLink}
						className={'toolbar-item spaced ' + (isLink ? 'active' : '')}
						aria-label="Insert link"
						title="Insert link"
						type="button"
					>
						<i className="format link" />
					</button>

					{/* COLOR for text */}
					{/* <TextEditorDropdownColorPicker
						disabled={!isEditable}
						buttonClassName="toolbar-item color-picker"
						buttonAriaLabel="Formatting text color"
						buttonIconClassName="icon"
						buttonIconName="font-color"
						color={fontColor}
						onChange={onFontColorSelect}
						title="text color"
					/> */}

					{/* COLOR for background */}
					{/* <TextEditorDropdownColorPicker
						disabled={!isEditable}
						buttonClassName="toolbar-item color-picker"
						buttonAriaLabel="Formatting background color"
						buttonIconClassName="icon"
						buttonIconName="bg-color"
						color={bgColor}
						onChange={onBgColorSelect}
						title="bg color"
					/> */}

					{/* Other formatting text options */}

					<TextEditorDropDown
						disabled={!isEditable}
						buttonClassName="toolbar-item spaced"
						buttonLabel=""
						buttonAriaLabel="Formatting options for additional text styles"
						buttonIconClassName="icon"
						buttonIconName="dropdown-more"
					>
						{/* Strikethrough */}
						<TextEditorDropDownItem
							onClick={() => {
								activeEditor.dispatchCommand(
									FORMAT_TEXT_COMMAND,
									'strikethrough'
								);
							}}
							className={'item ' + dropDownActiveClass(isStrikethrough)}
							title="Strikethrough"
							aria-label="Format text with a strikethrough"
						>
							<i className="icon strikethrough" />
							<span className="text">Strikethrough</span>
						</TextEditorDropDownItem>

						{/* Subscript */}
						<TextEditorDropDownItem
							onClick={() => {
								activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
							}}
							className={'item ' + dropDownActiveClass(isSubscript)}
							title="Subscript"
							aria-label="Format text with a subscript"
						>
							<i className="icon subscript" />
							<span className="text">Subscript</span>
						</TextEditorDropDownItem>

						{/* Superscript */}
						<TextEditorDropDownItem
							onClick={() => {
								activeEditor.dispatchCommand(
									FORMAT_TEXT_COMMAND,
									'superscript'
								);
							}}
							className={'item ' + dropDownActiveClass(isSuperscript)}
							title="Superscript"
							aria-label="Format text with a superscript"
						>
							<i className="icon superscript" />
							<span className="text">Superscript</span>
						</TextEditorDropDownItem>

						{/* Clear format */}
						<TextEditorDropDownItem
							onClick={clearFormatting}
							className="item"
							title="Clear text formatting"
							aria-label="Clear all text formatting"
						>
							<i className="icon trash" />
							<span className="text">Clear Formatting</span>
						</TextEditorDropDownItem>
					</TextEditorDropDown>

					<Divider />

					{/* INSERT - dropdown menu */}
					<TextEditorDropDown
						disabled={!isEditable}
						buttonClassName="toolbar-item spaced"
						buttonLabel="Insert"
						buttonAriaLabel="Insert specialized editor node"
						buttonIconClassName="icon plus"
					>
						<TextEditorDropDownItem
							onClick={() => {
								showModal('Insert Image', (onClose: () => void) => (
									<InsertImageDialog
										activeEditor={activeEditor}
										onClose={onClose}
									/>
								));
							}}
							className="item"
						>
							<i className="format insert-image icon image" />
							<span className="text">Image</span>
						</TextEditorDropDownItem>
					</TextEditorDropDown>
				</>
			)}

			<Divider />
			<ElementFormatDropdown
				disabled={!isEditable}
				value={elementFormat}
				editor={editor}
				isRTL={isRTL}
			/>

			{modal}
		</div>
	);
}
