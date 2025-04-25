"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  Value: boolean;
};

const SideBar = ({ Value }: Props) => {
  const { user } = useAuth();

  const commonNavigation = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const providerNavigation = [
    { name: "Manage Menu", href: "/dashboard/provider/manageMenue" },
    { name: "Respond Orders", href: "/dashboard/provider/respondToOrder" },
    { name: "View Order", href: "/dashboard/provider/viewOrder" },
    { name: "Add Meals", href: "/dashboard/provider/addMeals" },
    { name: "Provider Profile", href: "/dashboard/provider/profile" },
  ];

  const customerNavigation = [
    { name: "Select Meals", href: "/dashboard/customer/selectMeals" },
    { name: "Track Orders", href: "/dashboard/customer/trackOrders" },

    { name: "Customer Profile", href: "/dashboard/customer/profile" },
  ];

  const navigation =
    user?.role === "provider"
      ? [...commonNavigation, ...providerNavigation]
      : [...commonNavigation, ...customerNavigation];

  const pathname = usePathname();

  return (
    <div className="w-full h-full sidebar md:w-64">
      <div className="w-10/12 mx-auto h-full flex justify-center items-center">
        <ul
          className={`text-white flex justify-start w-full flex-col h-[80vh] gap-6 items-start text-left ${
            Value ? "opacity-0" : ""
          }`}
        >
          {navigation.map((item, id) => (
            <Link
              key={id}
              href={item.href}
              className={`text-white hover:text-gray-200 ${
                pathname === item.href
                  ? "bg-red-900 text-white p-2 rounded-lg w-full"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
