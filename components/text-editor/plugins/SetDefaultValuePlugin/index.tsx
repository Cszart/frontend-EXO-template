import { $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $insertNodes } from 'lexical';
import { useEffect } from 'react';

export default function SetDefaultValuePlugin(props: {
	html?: string;
}): JSX.Element {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		if (props.html) {
			editor.update(() => {
				// In the browser you can use the native DOMParser API to parse the HTML string.
				const parser = new DOMParser();
				const dom = parser.parseFromString(props.html!, 'text/html');

				// Once you have the DOM instance it's easy to generate LexicalNodes.
				const nodes = $generateNodesFromDOM(editor, dom);

				// Select the root
				$getRoot().select();

				// Insert them at a selection.
				$insertNodes(nodes);
			});
		}
	}, [editor, props.html]);

	return <></>;
}
