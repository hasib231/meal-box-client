import Link from "next/link";
import RootLayout from "./RootLayout";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footer: {
    text: string;
    linkText: string;
    linkHref: string;
  };
}

export default function AuthLayout({
  children,
  title,
  description,
  footer,
}: AuthLayoutProps) {
  return (
    <RootLayout>
      <div className="flex min-h-[calc(100vh-144px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="mt-8 bg-white p-6 shadow-sm border rounded-lg">
            {children}
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {footer.text}{" "}
            <Link
              href={footer.linkHref}
              className="font-medium text-primary hover:text-primary/80"
            >
              {footer.linkText}
            </Link>
          </p>
        </div>
      </div>
    </RootLayout>
  );
}
