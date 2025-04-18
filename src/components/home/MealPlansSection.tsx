import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MealPlansSection() {
  const plans = [
    {
      title: "Keto Friendly",
      price: "$89",
      period: "per week",
      description: "High-fat, low-carb meals designed to keep you in ketosis.",
      image:
        "https://images.unsplash.com/photo-1558005530-a7958896ec60?q=80&w=2942&auto=format&fit=crop",
      meals: "5 meals",
      features: ["Free delivery", "Fresh ingredients", "Nutritionist approved"],
    },
    {
      title: "Balanced Lifestyle",
      price: "$79",
      period: "per week",
      description:
        "Well-rounded meals with balanced macros for everyday nutrition.",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2960&auto=format&fit=crop",
      meals: "5 meals",
      features: ["Free delivery", "Chef curated", "Seasonal ingredients"],
      featured: true,
    },
    {
      title: "Plant-Based",
      price: "$75",
      period: "per week",
      description:
        "Delicious vegan meals packed with plant protein and nutrients.",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2940&auto=format&fit=crop",
      meals: "5 meals",
      features: ["Free delivery", "Organic produce", "High protein options"],
    },
  ];

  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Popular Meal Plans
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Plans to fit your lifestyle
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col overflow-hidden ${
                plan.featured ? "border-primary shadow-lg" : ""
              }`}
            >
              <div className="h-48 w-full relative">
                <Image
                  src={plan.image}
                  alt={plan.title}
                  fill
                  className="object-cover"
                />
                {plan.featured && (
                  <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                    Popular
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
                <CardDescription>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="ml-1 text-sm text-gray-500">
                      {plan.period}
                    </span>
                  </div>
                  <div className="mt-1">{plan.meals}</div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-6">{plan.description}</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-sm"
                    >
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button
                  className="w-full"
                  variant={plan.featured ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
