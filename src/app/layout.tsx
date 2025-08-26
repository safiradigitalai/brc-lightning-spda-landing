import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/hooks/use-theme";

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'E-book BRC Volume 1: 5 Erros que Reprovam Laudos de SPDA | Download Gratuito',
  description: 'Descubra os 5 erros mais críticos que fazem laudos de SPDA serem rejeitados e aprenda como evitá-los em minutos. E-book gratuito baseado na NBR 5419 para profissionais técnicos.',
  keywords: [
    'laudos SPDA',
    'NBR 5419',
    'sistema proteção descargas atmosféricas',
    'erro laudo técnico',
    'SPDA reprovado',
    'para-raios',
    'proteção contra raios',
    'laudo técnico aprovado',
    'engenharia elétrica',
    'BRC consultoria'
  ],
  authors: [{ name: 'BRC Consultoria' }],
  creator: 'BRC Consultoria',
  publisher: 'BRC Consultoria',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://brc-spda.com',
    title: 'E-book BRC Volume 1: 5 Erros que Reprovam Laudos de SPDA',
    description: 'Descubra os 5 erros mais críticos que fazem laudos de SPDA serem rejeitados e aprenda como evitá-los em minutos.',
    siteName: 'BRC Consultoria SPDA',
    images: [
      {
        url: '/og-spda-ebook.jpg',
        width: 1200,
        height: 630,
        alt: 'E-book BRC Volume 1 - 5 Erros que Reprovam Laudos de SPDA'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-book BRC: 5 Erros que Reprovam Laudos de SPDA',
    description: 'Guia gratuito para profissionais técnicos baseado na NBR 5419',
    images: ['/twitter-spda-card.jpg']
  },
  alternates: {
    canonical: 'https://brc-spda.com'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "BRC Consultoria",
              "url": "https://brc-spda.com",
              "description": "Especialistas em laudos técnicos e sistemas de proteção contra descargas atmosféricas (SPDA)",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Technical Support",
                "email": "contato@brc-spda.com"
              },
              "areaServed": "Brazil",
              "knowsAbout": ["SPDA", "NBR 5419", "Laudos Técnicos", "Proteção contra Raios", "Para-raios"]
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
