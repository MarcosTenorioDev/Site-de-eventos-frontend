import React from "react";
import Header from "@/layout/sidebarComponents/Header";
import Sidebar from "@/layout/sidebarComponents/Sidebar";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

export const LayoutAdmin = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<SignedIn>
				<Header />
				<div className="flex h-screen border-collapse overflow-hidden">
					<Sidebar />
					<main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 bg-secondary/10 pb-1">
						{children}
					</main>
				</div>
			</SignedIn>
			<SignedOut>
				<h2>404</h2>
			</SignedOut>
		</>
	);
};
