import { Major_Mono_Display } from "next/font/google";

const displayFont = Major_Mono_Display({ weight: "400", subsets: ["latin"] });

export const metadata = {
  title: "Genre Quiz",
  description: "Can you spot which electronic music genre a song belogs to?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="py-6 px-2 block flex justify-center border-b-2">
        <h1 className={`${displayFont.className} text-3xl`}>
          {metadata.title}
        </h1>
      </header>
      <main
        className={`px-4 pt-8 min-h-screen flex justify-center max-w-lg	ml-auto mr-auto`}
      >
        {children}
      </main>
    </>
  );
}
