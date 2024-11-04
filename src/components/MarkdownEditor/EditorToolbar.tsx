import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import {
	$getSelection,
	$isRangeSelection,
	CAN_REDO_COMMAND,
	CAN_UNDO_COMMAND,
	FORMAT_ELEMENT_COMMAND,
	FORMAT_TEXT_COMMAND,
	REDO_COMMAND,
	SELECTION_CHANGE_COMMAND,
	UNDO_COMMAND,
} from "lexical";
import {
	AlignCenterIcon,
	AlignLeftIcon,
	AlignRightIcon,
	BoldIcon,
	Heading1Icon,
	ItalicIcon,
	RotateCcwIcon,
	RotateCwIcon,
	StrikethroughIcon,
	UnderlineIcon,
} from "lucide-react";
import {
	ButtonHTMLAttributes,
	FC,
	ReactNode,
	useCallback,
	useEffect,
	useState,
} from "react";
import { Button } from "../ui/button";

type ToolbarIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	onClick: () => void;
	children: ReactNode;
	isSelected?: boolean;
};

const ToolbarIconButton: FC<ToolbarIconButtonProps> = ({
	onClick,
	children,
	isSelected,
	...props
}) => {
	return (
		<Button
			className={`w-auto h-auto p-1 rounded-sm text-black hover:bg-gray-200 ${
				isSelected && "bg-gray-200"
			}`}
			variant="ghost"
			onClick={onClick}
			type="button"
			{...props}
		>
			{children}
		</Button>
	);
};
const LowPriority = 1;

const Divisor = () => (
	<div className="flex border-r-2 rounded-full border-gray-300"></div>
);

interface IEditorToolbarProps {
	onChange: (rootText: string) => void;
	content: string;
}
const EditorToolbar = (props: IEditorToolbarProps) => {
	const [editor] = useLexicalComposerContext();

	const [canUndo, setCanUndo] = useState(false);
	const [canRedo, setCanRedo] = useState(false);
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const [isStrikethrough, setIsStrikethrough] = useState(false);
	const $updateToolbar = useCallback(() => {
		const selection = $getSelection();
		if ($isRangeSelection(selection)) {
			setIsBold(selection.hasFormat("bold"));
			setIsItalic(selection.hasFormat("italic"));
			setIsUnderline(selection.hasFormat("underline"));
			setIsStrikethrough(selection.hasFormat("strikethrough"));
		}
	}, []);

	const handleSave = (rootText: string) => {
		props.onChange(rootText);
	};

	useEffect(() => {
		// Carrega o conteúdo inicial se ele estiver disponível
		if (props.content) {
			const parsedContent = JSON.parse(props.content);
			editor.update(() => {
				const newEditorState = editor.parseEditorState(parsedContent);
				editor.setEditorState(newEditorState);
			});
		}
	}, [editor, props.content]);

	useEffect(() => {
		return mergeRegister(
			editor.registerUpdateListener(
				({ editorState, dirtyElements, dirtyLeaves }) => {
					editorState.read(() => {
						$updateToolbar();
					});

					if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
						return;
					}

					handleSave(JSON.stringify(editorState));
				}
			),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_payload, _newEditor) => {
					$updateToolbar();
					return false;
				},
				LowPriority
			),
			editor.registerCommand(
				CAN_UNDO_COMMAND,
				(payload) => {
					setCanUndo(payload);
					return false;
				},
				LowPriority
			),
			editor.registerCommand(
				CAN_REDO_COMMAND,
				(payload) => {
					setCanRedo(payload);
					return false;
				},
				LowPriority
			)
		);
	}, [editor, $updateToolbar]);

	const handleHeading = () => {
		editor.update(() => {
			const selection = $getSelection();

			if ($isRangeSelection(selection)) {
				$setBlocksType(selection, () => $createHeadingNode("h1"));
			}
		});
	};

	return (
		<div className="flex flex-wrap space-x-2 border-b pb-2 bg-muted px-4 pt-2">
			<ToolbarIconButton
				onClick={() => {
					editor.dispatchCommand(UNDO_COMMAND, undefined);
				}}
				disabled={!canUndo}
			>
				<RotateCcwIcon className="w-4 h-4" />
			</ToolbarIconButton>
			<ToolbarIconButton
				onClick={() => {
					editor.dispatchCommand(REDO_COMMAND, undefined);
				}}
				disabled={!canRedo}
			>
				<RotateCwIcon className="w-4 h-4" />
			</ToolbarIconButton>
			<Divisor />
			<ToolbarIconButton
				onClick={() => {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
				}}
				isSelected={isBold}
			>
				<BoldIcon className="w-4 h-4" />
			</ToolbarIconButton>
			<ToolbarIconButton
				onClick={() => {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
				}}
				isSelected={isItalic}
			>
				<ItalicIcon className="w-4 h-4" />
			</ToolbarIconButton>
			<ToolbarIconButton
				onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
				isSelected={isUnderline}
			>
				<UnderlineIcon className="w-4 h-4" />
			</ToolbarIconButton>
			<ToolbarIconButton
				onClick={() =>
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
				}
				isSelected={isStrikethrough}
			>
				<StrikethroughIcon className="w-4 h-4" />
			</ToolbarIconButton>
			<ToolbarIconButton onClick={handleHeading}>
				<Heading1Icon className="w-4 h-4" />
			</ToolbarIconButton>
			<Divisor />
			<ToolbarIconButton
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
				}}
			>
				<AlignLeftIcon className="w-4 h-4" />
			</ToolbarIconButton>
			<ToolbarIconButton
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
				}}
			>
				<AlignCenterIcon className="w-4 h-4" />
			</ToolbarIconButton>
			<ToolbarIconButton
				onClick={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
				}}
			>
				<AlignRightIcon className="w-4 h-4" />
			</ToolbarIconButton>
		</div>
	);
};

export default EditorToolbar;
