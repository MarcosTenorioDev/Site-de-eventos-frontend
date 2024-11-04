import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { useDebouncedCallback } from "use-debounce";
import EditorToolbar from "./EditorToolbar";
import { ExampleTheme } from "./ExampleTheme";

interface IMarkdownEditorProps {
	onValuesChanged: (content: string) => void;
	content: string;
}

function MarkdownEditor(props: IMarkdownEditorProps) {
	const initialConfig = {
		namespace: "MyEditor",
		theme: ExampleTheme,
		onError(error: Error) {
			throw error;
		},
		nodes: [HeadingNode],
	};
	const placeholder = "Insira a descrição do evento para os usuários verem...";

	// Função para capturar o conteúdo sempre que ele mudar
	const handleChange = useDebouncedCallback((content: string) => {
		props.onValuesChanged(content);
	}, 500);

	return (
		<div className="w-full mx-auto bg-white rounded-lg pb-5">
			<LexicalComposer initialConfig={initialConfig}>
				<EditorToolbar onChange={handleChange} content={props.content} />
				<div className="px-4 pt-2">
					<RichTextPlugin
						contentEditable={
							<ContentEditable className="focus:outline-none text-black" />
						}
						aria-placeholder={placeholder}
						placeholder={
							<div className="text-muted-foreground">{placeholder}</div>
						}
						ErrorBoundary={LexicalErrorBoundary}
					/>
					<HistoryPlugin />
					<AutoFocusPlugin />
				</div>
			</LexicalComposer>
		</div>
	);
}

export default MarkdownEditor;
