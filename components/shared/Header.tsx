import ClientHeader from "./ClientHeader";
import { ThemeToggle } from "../ThemeToggle";
import { auth } from "@clerk/nextjs/server";

const Header = async () => {
  const { sessionClaims } = await auth();
  const isAdmin = (sessionClaims?.isAdmin as boolean) ?? false;

  return <ClientHeader isAdmin={isAdmin} />;
};

export default Header;
