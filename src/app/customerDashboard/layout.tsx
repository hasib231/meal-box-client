"use client"

import { Button } from "@/components/ui/button";
// import Footer from "@/customerDashboardComponent/Footer";
import Navbar from "@/customerDashboardComponent/Navbar";
import { useState } from "react";

interface RootLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: RootLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="flex h-screen">
    {/* Sidebar */}
    <div
      className={` ${
        isCollapsed ? "w-0 lg:w-[7%]" : "w-[50%] lg:w-[20%]"
      } fixed h-full overflow-y-auto bg-red-800 transition-all duration-300 z-10 lg:z-0`}
    >
      <Navbar Value={isCollapsed} />
      <Button
        className={`fixed bottom-4 text-white z-20 ${
          isCollapsed ? "left-2 lg:w-[6%]" : "left-[10%] md:left-[30%] lg:left-[10%] lg:w-[7%]"
        }`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? "Expand" : "Collapse"}
      </Button>
    </div>
  
    {/* Main Content */}
    <div
      className={`mainbar ${
        isCollapsed
          ? "ml-0 lg:ml-[7%] w-full lg:w-[93%]"
          : "ml-0 lg:ml-[20%] w-full lg:w-[80%]"
      } h-full overflow-y-auto  transition-all duration-300`}
    >
      <main>{children}</main>
     <div>
     {/* <Footer /> */}
     </div>
    </div>
  </div>
  

  );
};

export default DashboardLayout;
