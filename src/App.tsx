import "react-toastify/dist/ReactToastify.css";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Event from "./pages/event/Event";
import MyTickets from "./pages/MyTickets/MyTickets";
import MyEvents from "./pages/myEvents/MyEvents";
import { LayoutAdmin } from "./layout/sidebarComponents";

function Layout({ children }: any) {
	return (
		<>
			<Navbar />
			{children}
			<Footer />
		</>
	);
}

const App = () => {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={
							<Layout>
								<Home />
							</Layout>
						}
					/>
					<Route
						path="/event/:id"
						element={
							<>
								<Navbar />
								<Event />
							</>
						}
					/>
					<Route
						path="/mytickets"
						element={
							<>
								<Layout>
									<MyTickets />
								</Layout>
							</>
						}
					/>
					<Route path="/managment">
						<Route
							path=""
							element={
								<LayoutAdmin>
									<MyEvents />
								</LayoutAdmin>
							}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
