import "react-toastify/dist/ReactToastify.css";
import Navbar from "./layout/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Event from "./pages/event/Event";
import MyTickets from "./pages/MyTickets/MyTickets";
import MyEvents from "./pages/admin/myEvents/MyEvents";
import { LayoutAdmin } from "./layout/sidebarComponents";
import EventInfo from "./pages/admin/eventInfo/EventInfo";
import CreateEvent from "./pages/admin/createEvent/CreateEvent";
import Checkout from "./pages/checkoutPage/Checkout";

function Layout({ children }: any) {
	return (
		<>
			<Navbar />
			{children}
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
					<Route
						path="/checkout/:id"
						element={
							<>
								<Navbar />
								<Checkout />
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
						<Route
							path="event/:id"
							element={
								<LayoutAdmin>
									<EventInfo />
								</LayoutAdmin>
							}
						/>
						<Route
							path="event"
							element={
								<LayoutAdmin>
									<EventInfo />
								</LayoutAdmin>
							}
						/>
						<Route
							path="event/create"
							element={
								<LayoutAdmin>
									<CreateEvent />
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
