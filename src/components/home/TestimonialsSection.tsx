export default function TestimonialsSection() {
  const testimonials = [
    {
      content:
        "MealBox has completely transformed my weeknight dinners. I used to stress about what to cook, but now I have delicious, healthy meals ready in minutes.",
      author: "Sarah Johnson",
      role: "Busy Professional",
    },
    {
      content:
        "As someone with specific dietary requirements, finding convenient meal options was always a challenge. MealBox's customization options have been a game-changer for me.",
      author: "Michael Chen",
      role: "Fitness Enthusiast",
    },
    {
      content:
        "The quality and variety of meals have exceeded my expectations. It's like having a personal chef who knows exactly what I like to eat!",
      author: "Emma Rodriguez",
      role: "Working Parent",
    },
  ];

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by customers
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 shadow-sm ring-1 ring-gray-200 p-8 relative"
            >
              <p className="text-gray-600">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-semibold text-primary">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
