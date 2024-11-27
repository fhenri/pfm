import FeatureAnimation from "@/components/animation/feature-animation";
import ImageAnimation from "@/components/animation/image-animation";

export default function Home() {
  return (
    <>
      <main className="flex items-center bg-white dark:bg-gray-800">
        <div className="container flex flex-col items-center justify-between px-6 py-8 mx-auto">
          <div className="flex flex-col py-24">
            <h1 className="w-full text-4xl font-light text-center text-gray-800 uppercase sm:text-5xl dark:text-white mt-6">
              Take control of your Personal Finance
            </h1>
            <h2 className="w-full max-w-2xl py-8 mt-6 mx-auto text-4xl font-bold text-center">
              <p className="bg-clip-text bg-gradient-to-r from-red-500 to-green-500 text-transparent uppercase">
                Personal Finance Manager
              </p>
            </h2>
          </div>
          <ImageAnimation />
        </div>
      </main>

      <section className="py-12 ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 lg:mb-16 flex justify-center items-center flex-col gap-x-0 gap-y-6 lg:gap-y-0 lg:flex-row lg:justify-between max-md:max-w-lg max-md:mx-auto">
                  <div className="relative w-full text-center lg:text-left lg:w-2/4">
                      <h2 className="text-4xl font-bold text-gray-900 leading-[3.25rem] lg:mb-6 mx-auto max-w-max lg:max-w-md lg:mx-0">Enjoy the finest features with this product</h2>
                  </div>
                  <div className="relative w-full text-center  lg:text-left lg:w-2/4">
                      <p className="text-lg font-normal text-gray-500 mb-5">We provide all the advantages that can simplify all your financial life without any further requirements</p> 
                  </div>
              </div>
        </div>
        <FeatureAnimation/>
      </section>
    </>
  );
}
