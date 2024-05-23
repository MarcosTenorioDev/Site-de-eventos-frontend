import "react-toastify/dist/ReactToastify.css";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Event from "./pages/event/Event";
import MyEvents from "./pages/MyEvents/MyEvents";

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
						path="/myevents"
						element={
							<>
								<Layout>
									<MyEvents />
								</Layout>
							</>
						}
					/>
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
