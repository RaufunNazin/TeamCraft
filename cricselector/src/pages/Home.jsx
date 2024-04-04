import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar active="home" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 lg:gap-y-0 items-center my-auto">
        <div className="flex justify-center">
          <div className="flex flex-col gap-y-8">
            <div className="text-[50px] lg:text-[120px] text-center lg:text-left font-black font-sans uppercase text-xdark lg:-mb-5">
              Build Your <br /> Dream team
            </div>
            <div className="text-lg text-center lg:text-left lg:text-3xl text-xgray w-[300px] mx-auto lg:mx-0 lg:w-[600px] -mt-5">
              Experience a whole new idea of the player selection process
            </div>
            <div className="bg-xred w-fit mx-auto lg:mx-0 px-3 py-1 lg:px-5 lg:py-3 text-lg lg:text-xl font-bold text-white rounded-md cursor-pointer hover:bg-red-800 transition-all duration-200">
              Start Now !
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="src/assets/hero3.png"
            alt="CricSelector"
            className="img-fluid h-[300px] lg:h-[700px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
