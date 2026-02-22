"use client"

import { headerLinks } from "@/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"


const NavItems = () => {

    const pathname = usePathname();

  return (
    <ul className="md:flex-between flex flex-col w-full items-start gap-5 md:flex-row ">
        {headerLinks.map((links) => {
          const isActive  = pathname === links.route;
          return (
            <li key={links.route}
            className={`${isActive && "text-primary-500"} flex-center p-medium-16 whitespace-nowrap`}
            >
                <Link href={links.route} >{links.label}</Link>
            </li>
        )})}
    </ul>
  )
}

export default NavItems