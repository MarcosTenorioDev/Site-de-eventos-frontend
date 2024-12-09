import { useT } from "@/assets/i18n";
import CustomClerkUserButton from "@/components/customClerkUserButton";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { Cross2Icon } from "@radix-ui/react-icons";
import Hamburger from "hamburger-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const Navbar = () => {
  const t = useT();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <SignedIn>
        <nav className="relative px-4 py-4 flex justify-between items-center bg-primary">
          <div className="flex sm:max-w-7xl w-full justify-between items-center mx-auto">
            <Link
              to={"/"}
              className="font-primary text-white text-2xl font-normal"
            >
              {t("application.global.applicationName")}
            </Link>
            <div className={`lg:hidden`}>
              <Hamburger
                toggled={isMenuOpen}
                toggle={toggleMenu}
                color="white"
              />
            </div>
            <nav className="flex-1 px-10 justify-end gap-8 hidden lg:flex">
              <Link
                className="font-primary h-9 px-4 py-2 text-secondary no-underline hover:underline hover:underline-offset-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                to={"/managment"}
              >
                {t("application.components.navbar.createEvent")}
              </Link>
              <Link
                className="font-primary h-9 px-4 py-2 text-secondary no-underline hover:underline hover:underline-offset-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                to={"/mytickets"}
              >
                {t("application.components.navbar.myTickets")}
              </Link>
            </nav>
            <div className="hidden lg:flex">
              <CustomClerkUserButton />
            </div>
          </div>
        </nav>
        <div
          className={`navbar-menu relative z-50 ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <div
            className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25 "
            onClick={toggleMenu}
          ></div>
          <div className="fixed top-0 right-0 bottom-0 flex flex-col w-4/6 max-w-[300px] py-6 px-6 bg-white border-r overflow-y-auto">
            <div className="flex items-center justify-between w-full">
              {t("application.global.applicationName")}
              <Cross2Icon
                className="h-10 w-10 text-red-600 font-bold cursor-pointer"
                onClick={toggleMenu}
              />
            </div>

            <div className="flex items-center flex-col mb-8 mt-4">
              <CustomClerkUserButton showName={true} />
            </div>
            {/* Botoes de navegação */}
            <nav className="flex flex-col gap-5">
              <Link
                className="h-9 px-4 py-2 bg-primary no-underline hover:underline hover:underline-offset-2 text-primary-foreground shadow hover:opacity-90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                to={"/managment"}
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                {t("application.components.navbar.createEvent")}
              </Link>
              <Link
                className="h-9 px-4 py-2 bg-primary no-underline hover:underline hover:underline-offset-2 text-primary-foreground shadow hover:opacity-90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                to={"/mytickets"}
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                {t("application.components.navbar.myTickets")}
              </Link>
            </nav>
            <div className="mt-auto">
              <div className="pt-6">
                <SignOutButton>
                  <Button variant={"default"} className="w-full">
                    {t("application.components.navbar.logout")}
                  </Button>
                </SignOutButton>
              </div>
              <p className="mt-4 text-sm font-semibold text-center text-gray-400">
                <span>© Obon {new Date().getFullYear()}</span>
              </p>
            </div>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <nav className="relative px-4 py-4 flex justify-between items-center bg-primary">
          <div className="flex sm:max-w-7xl w-full justify-between items-center mx-auto">
            <Link
              to={"/"}
              className="font-primary text-white text-2xl font-normal"
            >
              {t("application.global.applicationName")}
            </Link>
            <div className={`sm:hidden`}>
              <Hamburger
                toggled={isMenuOpen}
                toggle={toggleMenu}
                color="white"
              />
            </div>
            <nav className="px-3 flex-1 w-full justify-end gap-8 hidden sm:flex">
              <SignInButton
                mode="modal"
                forceRedirectUrl={`/managment`}
                fallbackRedirectUrl={`/managment`}
                signUpForceRedirectUrl={`/managment`}
                signUpFallbackRedirectUrl={`/managment`}
              >
                <Button variant={"link"} className="font-primary">
                  Criar eventos
                </Button>
              </SignInButton>
              <div className="text-white font-primary">
                {/* TODO: Retirar botão em volta de SignInButton */}
                <div className="h-9 px-4 py-2 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  <SignInButton
                    mode="modal"
                    forceRedirectUrl={`/`}
                    fallbackRedirectUrl={`/`}
                    signUpForceRedirectUrl={`/`}
                    signUpFallbackRedirectUrl={`/`}
                  >
                    {t("application.components.navbar.login")}
                  </SignInButton>
                </div>
              </div>
              <div className="text-white font-primary">
                <Button variant={"outline"}>
                  <SignUpButton mode="modal">
                    {t("application.components.navbar.register")}
                  </SignUpButton>
                </Button>
              </div>
            </nav>
            <div className="hidden lg:flex">
              <CustomClerkUserButton />
            </div>
          </div>
        </nav>
        <div
          className={`navbar-menu relative z-50 ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <div
            className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25 "
            onClick={toggleMenu}
          ></div>
          <div className="fixed top-0 right-0 bottom-0 flex flex-col w-4/6 max-w-[300px] py-6 px-6 bg-white border-r overflow-y-auto">
            <div className="flex items-center justify-between w-full font-primary">
              {t("application.global.applicationName")}
              <Cross2Icon
                className="h-10 w-10 text-red-600 font-bold cursor-pointer"
                onClick={toggleMenu}
              />
            </div>
            {/* Botoes de navegação */}
            <nav className="flex flex-col">
              <div className="flex flex-col gap-3 mt-8">
                <div className="text-white font-primary">
                  <Button variant={"default"} className="w-full">
                    <SignInButton
                      mode="modal"
                      forceRedirectUrl={`/`}
                      fallbackRedirectUrl={`/`}
                      signUpForceRedirectUrl={`/`}
                      signUpFallbackRedirectUrl={`/`}
                    >
                      {t("application.components.navbar.login")}
                    </SignInButton>
                  </Button>
                </div>
                <div className="text-white font-primary">
                  <Button variant={"default"} className="w-full">
                    <SignUpButton mode="modal">
                      {t("application.components.navbar.register")}
                    </SignUpButton>
                  </Button>
                </div>
              </div>
              <Button variant={"linkSecondary"} className="font-primary mt-3">
                Criar eventos
              </Button>
            </nav>
            <div className="mt-auto">
              <p className="text-sm font-semibold text-center text-gray-400">
                <span>© Obon {new Date().getFullYear()}</span>
              </p>
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
};

export default Navbar;
