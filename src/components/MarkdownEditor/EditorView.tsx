import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { ExampleTheme } from "./ExampleTheme";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";

interface IEditorViewProps {
	content: string;
}

const initialConfig = {
	namespace: "MyEditor",
	theme: ExampleTheme,
	editable: false,
	onError(error: Error) {
		throw error;
	},
	nodes: [HeadingNode],
};

const ContentLoader = ({ content }: { content: string }) => {
	const [editor] = useLexicalComposerContext();
	const [isValidJson, setIsValidJson] = useState(true);

	useEffect(() => {
		try {
			const parsedContent = JSON.parse(content);
			editor.update(() => {
				const newEditorState = editor.parseEditorState(parsedContent);
				editor.setEditorState(newEditorState);
			});
		} catch {
			setIsValidJson(false);
		}
	}, [editor, content]);

	return isValidJson ? null : <h3 className="text-black">{content}</h3>;
};

function EditorView({ content }: IEditorViewProps) {
	return (
		<div className="w-full mx-auto">
			<LexicalComposer initialConfig={initialConfig}>
				<ContentLoader content={content} />

				<RichTextPlugin
					contentEditable={
						<ContentEditable className="focus:outline-none text-black" />
					}
					ErrorBoundary={LexicalErrorBoundary}
				/>
			</LexicalComposer>
		</div>
	);
}

export default EditorView;
