import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { auth } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PromptVault - Professional Prompt Library & Template Store",
  description: "Discover and use 50+ production-quality AI prompts for ChatGPT, Claude, and Gemini. Boost your productivity with expert-crafted prompt templates.",
  keywords: ["AI prompts", "ChatGPT prompts", "Claude prompts", "prompt engineering", "AI templates"],
  authors: [{ name: "PromptVault" }],
  openGraph: {
    title: "PromptVault - Professional Prompt Library & Template Store",
    description: "50+ production-quality AI prompts for developers, writers, and businesses",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptVault - Professional Prompt Library",
    description: "50+ production-quality AI prompts for ChatGPT, Claude, and Gemini",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Navbar user={session?.user} />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t py-8 mt-20">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold mb-4">PromptVault</h3>
                <p className="text-sm text-muted-foreground">
                  Professional AI prompt templates for developers, writers, and businesses.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="/browse" className="hover:text-foreground">Browse Prompts</a></li>
                  <li><a href="/pricing" className="hover:text-foreground">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                  <li><a href="#" className="hover:text-foreground">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
              © 2024 PromptVault. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
