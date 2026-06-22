import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function RootPage() {
  const cookieStore = await cookies();
  const googTrans = cookieStore.get('googtrans');
  let targetLang = 'en';

  if (googTrans) {
    const langCode = googTrans.value.split('/').pop();
    if (langCode && ['en', 'fr', 'pt', 'sw'].includes(langCode)) {
      targetLang = langCode;
    }
  }

  redirect(`/${targetLang}`);
}
