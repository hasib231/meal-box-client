import Image from "next/image";

const customerProfile = () => {
  return (
    <div>
      <div>
        <div className="flex justify-between flex-col md:flex-row items-center w-11/12 mx-auto py-10">
          <div className="md:w-6/12">
            <Image
              width={600}
              height={800}
              src="https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2940&auto=format&fit=crop"
              alt="Healthy meal plate with fresh ingredients"
              className="rounded-lg h-[70vh]"
              priority
            />
          </div>

          <form  className="md:w-5/12">
            {/* Remove @csrf for React – handle CSRF from backend */}
            <div className="w-full bg-slate-400 p-12 rounded-lg">
              <div className="flex justify-start gap-5">
                <div className="w-full">
                  <label className="font-bold" htmlFor="email">
                    EMAIL
                  </label>
                  <br />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="EMAIL"
                    className="w-full input input-success"
                  />
                </div>
                <div className="w-full">
                  <label className="font-bold" htmlFor="username">
                    NAME
                  </label>
                  <br />
                  <input
                    id="username"
                    type="text"
                    placeholder="NAME"
                    name="username"
                    className="input input-success w-full"
                  />
                </div>
              </div>

              <br />

              <div>
                <label className="font-bold" htmlFor="number">
                  PHONE
                </label>
                <input
                  id="number"
                  type="text"
                  name="number"
                  placeholder="PHONE"
                  className="input input-success w-full"
                />
              </div>

              <br />

              <div>
                <label className="font-bold" htmlFor="message">
                  MESSAGE
                </label>
                <br />
                <textarea
                  id="message"
                  name="message"
                  placeholder="MESSAGE"
                  className="textarea textarea-success w-full"
                ></textarea>
              </div>

              <br />

              <button className="btn text-black w-full" type="submit">
                UPDATE PROFILE
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default customerProfile;
