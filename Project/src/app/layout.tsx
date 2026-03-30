import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoreProvider from '@/lib/StoreProvider';
import MainWrapper from '@/components/MainWrapper';
import '@/styles/global.css';

export const metadata = {
  title: 'ВК Маруся - Онлайн кинотеатр',
  description: 'Смотрите фильмы онлайн в хорошем качестве',
  icons: {
    icon: '/icons/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <StoreProvider>
          <Header />
          <MainWrapper>{children}</MainWrapper>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}