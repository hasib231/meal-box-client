"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChefHat, Users, Leaf, Heart } from 'lucide-react';

export default function AboutUsPage() {
  const team = [
    {
      name: "Sarah Chen",
      role: "Executive Chef",
      image: "https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "With 15 years of culinary experience, Sarah leads our kitchen with passion and innovation."
    },
    {
      name: "Michael Rodriguez",
      role: "Nutrition Director",
      image: "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "A certified nutritionist ensuring every meal is both delicious and nutritionally balanced."
    },
    {
      name: "Emily Thompson",
      role: "Operations Manager",
      image: "https://images.pexels.com/photos/3810792/pexels-photo-3810792.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Keeping our operations running smoothly while maintaining the highest quality standards."
    }
  ];

  const values = [
    {
      icon: ChefHat,
      title: "Culinary Excellence",
      description: "We believe in creating exceptional dining experiences through expert craftsmanship and premium ingredients."
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Your satisfaction is our priority. We're committed to exceeding your expectations in every way."
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "We're dedicated to environmental responsibility through sustainable practices and packaging."
    },
    {
      icon: Users,
      title: "Community Impact",
      description: "Supporting local suppliers and giving back to our community is at the heart of what we do."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-red-600/20 pt-14">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Our Story
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Founded in 2020, MealBox was born from a simple idea: make healthy eating effortless 
              without compromising on taste or quality. Today, were proud to serve thousands of 
              satisfied customers with chef-crafted meals delivered right to their doorstep.
            </p>
            <div className="mt-10">
              <Button size="lg">Join Our Journey</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Values</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              These core principles guide everything we do at MealBox.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {values.map((value) => (
                <div key={value.title} className="flex flex-col items-center text-center">
                  <div className="mb-6 rounded-lg bg-red-600/10 p-4">
                    <value.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <dt className="text-xl font-semibold leading-7">{value.title}</dt>
                  <dd className="mt-4 flex flex-auto flex-col leading-7 text-gray-600 dark:text-gray-300">
                    <p className="flex-auto">{value.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Meet Our Team</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              The passionate individuals behind MealBoxs success.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {team.map((member) => (
              <Card key={member.name} className="bg-white dark:bg-gray-800">
                <CardContent className="pt-6">
                  <div className="relative">
                    <img
                      className="aspect-[3/2] w-full rounded-2xl object-cover"
                      src={member.image}
                      alt={member.name}
                    />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold leading-8">{member.name}</h3>
                  <p className="text-base leading-7 text-red-600">{member.role}</p>
                  <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Trusted by Thousands
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Our impact in numbers
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {[
                { id: 1, name: 'Meals Delivered', value: '1M+' },
                { id: 2, name: 'Happy Customers', value: '50K+' },
                { id: 3, name: 'Cities Served', value: '25+' },
                { id: 4, name: 'Team Members', value: '100+' },
              ].map((stat) => (
                <div key={stat.id} className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300">
                    {stat.name}
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}