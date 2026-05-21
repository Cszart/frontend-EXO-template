/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

// Lexical
import { $getRoot } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';

// Lexical plugins
import {
	InitialConfigType,
	LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import {
	AutoLinkPlugin,
	createLinkMatcherWithRegExp,
} from '@lexical/react/LexicalAutoLinkPlugin';

import { TRANSFORMERS } from '@lexical/markdown';

// Custom plugins
import ToolbarPlugin, {
	blockTypeToBlockName,
} from './plugins/ToolbarPlugin/ToolbarPlugin';
import ImagesPlugin from './plugins/ImagesPlugin';
import SetDefaultValuePlugin from './plugins/SetDefaultValuePlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import ActionsPlugin from './plugins/ActionsPlugin';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';

// Nodes
import { ImageNode } from './nodes/Image/ImageNode';

// Styles
import TextEditorDefaultTheme from './themes/DefaultTheme';
import KeywordsPlugin from './plugins/KeywordsPlugin';
import { KeywordNode } from './nodes/keywords';

// Const
// For Auto Link
const URL_REGEX =
	/((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const EMAIL_REGEX =
	/(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

const MATCHERS = [
	createLinkMatcherWithRegExp(URL_REGEX, (text) => {
		return text.startsWith('http') ? text : `https://${text}`;
	}),
	createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => {
		return `mailto:${text}`;
	}),
];

// Placeholder element for editor
function Placeholder(): JSX.Element {
	return <div className="editor-placeholder">Enter some text...</div>;
}

// Editor configuration
const editorConfig: InitialConfigType = {
	namespace: 'SimpleTextEditor',
	// The editor theme
	theme: TextEditorDefaultTheme,
	// Handling of errors during update
	onError(error: any) {
		console.error('[TextEditor] error: ', error);
		throw error;
	},
	// Any custom nodes go here
	nodes: [
		HeadingNode,
		ListNode,
		ListItemNode,
		QuoteNode,
		CodeNode,
		CodeHighlightNode,
		TableNode,
		TableCellNode,
		TableRowNode,
		AutoLinkNode,
		LinkNode,
		ImageNode,
		KeywordNode,
	],
};

// Editor component
export interface SimpleTextEditorProps {
	onChange: (editorState: string) => void;
	defaultHtml?: string;
}

const SimpleTextEditor = (props: SimpleTextEditorProps): JSX.Element => {
	// To see what type of block the editor is actually using
	const [blockType, setBlockType] =
		useState<keyof typeof blockTypeToBlockName>('paragraph');
	const [floatingAnchorElem, setFloatingAnchorElem] =
		useState<HTMLDivElement | null>(null);

	// Prop for the toolbar
	const [, setIsLinkEditMode] = useState(false);

	// Util Functions
	const onRef = (_floatingAnchorElem: HTMLDivElement): void => {
		if (_floatingAnchorElem !== null) {
			setFloatingAnchorElem(_floatingAnchorElem);
		}
	};
	return (
		<LexicalComposer initialConfig={editorConfig}>
			<div className="editor-container">
				<ToolbarPlugin
					blockType={blockType}
					setBlockType={setBlockType}
					setIsLinkEditMode={setIsLinkEditMode}
				/>

				<div className="editor-inner">
					<RichTextPlugin
						contentEditable={
							<div className="editor-scroller">
								<div className="editor" ref={onRef}>
									<ContentEditable className="editor-input" />
								</div>
							</div>
						}
						placeholder={<Placeholder />}
						ErrorBoundary={LexicalErrorBoundary}
					/>
					<OnChangePlugin
						onChange={async (editorState, editor) => {
							props.onChange(
								editorState.read(() => {
									// Return the text content of the Editor
									// This will return the raw HTML written inside
									if (blockType === 'code') {
										return $getRoot().getTextContent();
									}

									// Else, return the HTML generated based on the content of the editor
									return $generateHtmlFromNodes(editor);
								})
							);
						}}
						ignoreSelectionChange
					/>
					{/* Lexical plugins */}
					<AutoFocusPlugin />
					<HistoryPlugin />
					<LinkPlugin />
					<ListPlugin />
					<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
					<AutoLinkPlugin matchers={MATCHERS} />
					<ClickableLinkPlugin />

					{/* Local plugins */}
					<CodeHighlightPlugin />
					<ImagesPlugin />
					<KeywordsPlugin />

					{floatingAnchorElem && (
						<>
							<FloatingTextFormatToolbarPlugin
								anchorElem={floatingAnchorElem}
							/>
						</>
					)}
				</div>

				<SetDefaultValuePlugin html={props.defaultHtml} />
				<ActionsPlugin isRichText={true} />
			</div>
		</LexicalComposer>
	);
};

export default SimpleTextEditor;
