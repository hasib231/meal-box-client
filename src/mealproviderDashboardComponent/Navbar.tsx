"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


type Props = {
  Value: boolean;
};

const navigation = [
  
 
  { name: "Post Meal", href: "/mealProviderDashboard/postMeal" },
  { name: "Home", href: "/" }
];

const Navbar = ({ Value }: Props) => {

  
  const pathname=usePathname() 
  console.log(pathname)
  return (
    <div className="w-full  h-full sidebar">
      <div className="w-9/12 mx-auto  h-full flex justify-center  items-center">
        <ul
          className={` text-white  flex justify-start w-full flex-col   h-[80vh]  gap-6 items-start    text-left items-center${
            Value ? " opacity-0" : ""
          }`}
        >
          {navigation.map((item, id) => (
            <Link
              key={id}
              href={item.href}
              className={`text-black ${pathname==item.href?"bg-white text-black p-2 rounded-lg":""}`}
            >
              {item.name}
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
