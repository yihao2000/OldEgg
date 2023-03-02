import Layout from '@/components/layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';

export default function ShopPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <div>asdsa</div>
    </Layout>
  );
}
