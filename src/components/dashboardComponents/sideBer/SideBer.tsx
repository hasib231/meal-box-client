"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


type Props = {
  Value: boolean;
};

// const navigation = [
//   { name: "Select Meals", href: "/customerDashboard/select-meals" },
//   { name: "Track Orders", href: "/customerDashboard/track-order" },
//   { name: "Manage Preferences", href: "/customerDashboard/manage-preference" },
//   { name: "Find Meals", href: "/customerDashboard/find-meals" },
//   { name: "Order Meal", href: "/customerDashboard/order-meal" },
//   { name: "Customer Profile", href: "/customerDashboard/customer-profile" },
//   { name: "Home", href: "/" }
// ];

const SideBar = ({ Value }: Props) => {
  
  const user = {"role":"customer"}
  const comonNavigation = [
      { name: "Home", href: "/" },
  ];
    
  const providerNavigation = [
      { name: "Manage Menue", href: "/dashboard/provider/manageMenue" },
      { name: "Respond Orders", href: "/dashboard/provider/respondToOrder" },
      { name: "View Order", href: "/dashboard/provider/viewOrder" },
      { name: "Add Meals", href: "/dashboard/provider/addMeals" },
      { name: "Provider Profile", href: "/dashboard/provider-profile" },
  ];
    
  const customerNavigation = [
      { name: "Find Meals", href: "/findMeals" },
      { name: "Select Meals", href: "/dashboard/customer/selectMeals" },
      { name: "Track Orders", href: "/dashboard/customer/trackOrders" },
      { name: "Manage Preferences", href: "/dashboard/customer/managePreferences" },
      { name: "Customer Profile", href: "/dashboard/customer/profile" },
  ];
  const navigation =user?.role === 'provider' ? [...comonNavigation, ...providerNavigation] : [...comonNavigation, ...customerNavigation];
  
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

export default SideBar;
