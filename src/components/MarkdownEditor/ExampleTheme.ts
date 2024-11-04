export const ExampleTheme = {
	code: "bg-gray-200 font-mono block px-8 py-8 pt-0.5 text-sm md:text-base",
	heading: {
		h1: "text-2xl lg:text-4xl font-semibold mt-0 mb-1",
		h2: "text-lg font-semibold mt-1 uppercase",
		h3: "font-semibold mt-0 mb-1",
		h4: "font-semibold mt-0 mb-1",
		h5: "font-semibold mt-0 mb-1",
	},
	image: "editor-image",
	link: "text-blue-500 underline text-bold",
	list: {
		nested: {
			listitem: "ml-4", // Indent nested list items by 1rem
			ol: "list-decimal pl-8",
			ul: "list-disc pl-8",
		},
		ol: "list-decimal pl-8", // Use decimal numbers for ordered lists and add left padding of 2rem
		ul: "list-disc pl-8", // Use disc bullets for unordered lists and add left padding of 2rem
		listitem: "mb-2", // Add bottom margin of 0.5rem to list items
		listitemChecked: "line-through text-gray-500", // Style checked list items with line-through and gray text
		listitemUnchecked: "", // Unchecked list items don't require additional styling
	},
	ltr: "text-left",
	paragraph: "mt-0 mb-2",
	quote: "ml-4 italic border-l-4 border-gray-300 pl-4 py-2",
	rtl: "text-right",
	text: {
		bold: "font-bold",
		code: "bg-gray-300 px-1 font-mono text-sm",
		hashtag: "text-blue-600",
		italic: "italic",
		overflowed: "editor-text-overflowed",
		strikethrough: "line-through",
		underline: "underline",
		underlineStrikethrough: "underline line-through",
	},
};
