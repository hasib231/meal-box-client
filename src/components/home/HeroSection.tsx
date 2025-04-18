import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center lg:grid-cols-2 gap-8 py-8">
          <div className="pt-10 pb-24 sm:pb-32 lg:pt-16 lg:pb-48">
            <div>
              <div className="hidden sm:block">
                <div className="inline-flex items-center space-x-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 ring-1 ring-inset ring-orange-500/10">
                  <span>New Meal Plans Available</span>
                  <svg
                    className="h-1.5 w-1.5 fill-orange-600"
                    viewBox="0 0 6 6"
                    aria-hidden="true"
                  >
                    <circle cx={3} cy={3} r={3} />
                  </svg>
                </div>
              </div>
              <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Delicious meals tailored to{" "}
                <span className="text-primary">your lifestyle</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Personalized meal planning and delivery service that fits your
                dietary preferences and schedule. Eat healthy without the
                hassle.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Button size="lg" asChild>
                  <Link href="/meal-plans">Browse Meal Plans</Link>
                </Button>
                <Link
                  href="/how-it-works"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full">
            <Image
              src="https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2940&auto=format&fit=crop"
              alt="Healthy meal plate with fresh ingredients"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
