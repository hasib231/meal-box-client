import Image from "next/image";

const TrackOrder = () => {
  return (
    <div>
      <h1 className="text-4xl py-6 my-8 bg-red-800 text-center text-white">
        Show Your Pending And Past Order
      </h1>

      {/* all card of pending and past order in customer dashboard */}
      <div className="flex flex-col lg:grid grid-cols-3 lg:flex-wrap justify-between w-11/12 mx-auto gap-5 ">
        <div
          //   data-aos="zoom-in"
          //   data-aos-duration="1500"
          className="w-full     backdrop-blur-md  rounded-lg shadow-lg border-white/20"
        >
          <div className="w-10/12 mx-auto h-full flex flex-col   justify-between">
            <div className="flex justify-center">
              <Image
                width={400}
                height={400}
                src="https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2940&auto=format&fit=crop"
                alt="Healthy meal plate with fresh ingredients"
                className=" rounded-lg "
                priority
              />
            </div>

            <div>
              <p className="text-center text-[6vh] text-red-800">pending</p>
              <p className="text-lg py-8 ">
               A timeless favorite! Our stone-baked cheese pizza features a crispy golden crust, rich tomato sauce, and a generous layer of melted mozzarella. Perfectly seasoned and freshly made — every bite delivers pure comfort and flavor. Ideal for sharing or indulging solo!
              </p>
            </div>
          </div>
        </div>
        <div
          //   data-aos="zoom-in"
          //   data-aos-duration="1500"
          className="w-full     backdrop-blur-md  rounded-lg shadow-lg border-white/20"
        >
          <div className="w-10/12 mx-auto h-full flex flex-col   justify-between">
            <div className="flex justify-center">
              <Image
                width={400}
                height={400}
                src="https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2940&auto=format&fit=crop"
                alt="Healthy meal plate with fresh ingredients"
                className=" rounded-lg "
                priority
              />
            </div>

            <div>
              <p className="text-center text-[6vh] text-red-800">pending</p>
              <p className="text-lg py-8 ">
               A timeless favorite! Our stone-baked cheese pizza features a crispy golden crust, rich tomato sauce, and a generous layer of melted mozzarella. Perfectly seasoned and freshly made — every bite delivers pure comfort and flavor. Ideal for sharing or indulging solo!
              </p>
            </div>
          </div>
        </div>
        
      
       
      </div>
    </div>
  );
};

export default TrackOrder;
