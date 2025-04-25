import Image from "next/image";
// import aos from 'aos';
// import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
// aos.init();
const SelectMeal = () => {
  return (
    <div className="w-full ">
      {/* select option section */}
      <div className=" w-full">
        <div className="flex justify-around  items-center  ">
          <div className=" w-3/12">
            <fieldset className="fieldset w-full ">
              <legend className="fieldset-legend">restriction</legend>
              <select
                defaultValue="Pick a browser"
                className="select border border-black  w-full"
              >
                <option disabled={true}>Select</option>
                <option>kito</option>
                <option>Fatty</option>
                <option>Vegan</option>
              </select>
            </fieldset>
          </div>
          <div className=" w-3/12">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">restriction</legend>
              <select
                defaultValue="Pick a browser"
                className="select border border-black  "
              >
                <option disabled={true}>Select</option>
                <option>kito</option>
                <option>Fatty</option>
                <option>Vegan</option>
              </select>
            </fieldset>
          </div>
          <div className=" w-3/12">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">portion size</legend>
              <select
                defaultValue="Pick a browser"
                className="select border border-black  "
              >
                <option disabled={true}>Select</option>
                <option>kito</option>
                <option>Fatty</option>
                <option>Vegan</option>
              </select>
            </fieldset>
          </div>
          <div className=" w-2/12">


          <fieldset className="fieldset">
              
              <legend className="fieldset-legend">Search</legend>
             <form >
             <input  type="text" placeholder="search meal" className="border border-black input input-secondary" />
             </form>
            </fieldset>
         

          </div>
        </div>

        {/* head line  */}
        <h1 className=" text-center text-3xl my-5 py-5 bg-red-800 text-white">
          Select Your Meal According To Your Prefered Choice Of Food
        </h1>
      </div>
      {/* all card of meal in customer dashboard */}
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
              <p className="text-center text-[6vh]">Pizza</p>
              <p className="text-lg py-8 ">
               A timeless favorite! Our stone-baked cheese pizza features a crispy golden crust, rich tomato sauce, and a generous layer of melted mozzarella. Perfectly seasoned and freshly made — every bite delivers pure comfort and flavor. Ideal for sharing or indulging solo!
              </p>

              <div className="flex justify-end w-full my-2">
                <button className="btn btn-secondary text-white bg-red-800  text-2xl py-3 px-5">Select Meal</button>
                
              </div>
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
              <p className="text-center text-[6vh]">Ice cream</p>
              <p className="text-lg py-8 ">
               A timeless favorite! Our stone-baked cheese pizza features a crispy golden crust, rich tomato sauce, and a generous layer of melted mozzarella. Perfectly seasoned and freshly made — every bite delivers pure comfort and flavor. Ideal for sharing or indulging solo!
              </p>

              <div className="flex justify-end w-full my-2">
                <button className="btn btn-secondary text-white bg-red-800  text-2xl py-3 px-5">Select Meal</button>
                
              </div>
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
              <p className="text-center text-[6vh]">Hamburger</p>
              <p className="text-lg py-8 ">
               A timeless favorite! Our stone-baked cheese pizza features a crispy golden crust, rich tomato sauce, and a generous layer of melted mozzarella. Perfectly seasoned and freshly made — every bite delivers pure comfort and flavor. Ideal for sharing or indulging solo!
              </p>

              <div className="flex justify-end w-full my-2">
                <button className="btn btn-secondary text-white bg-red-800  text-2xl py-3 px-5">Select Meal</button>
                
              </div>
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
              <p className="text-center text-[6vh]">Candy</p>
              <p className="text-lg py-8 ">
               A timeless favorite! Our stone-baked cheese pizza features a crispy golden crust, rich tomato sauce, and a generous layer of melted mozzarella. Perfectly seasoned and freshly made — every bite delivers pure comfort and flavor. Ideal for sharing or indulging solo!
              </p>

              <div className="flex justify-end w-full my-2">
                <button className="btn btn-secondary text-white bg-red-800  text-2xl py-3 px-5">Select Meal</button>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectMeal;
