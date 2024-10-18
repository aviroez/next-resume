'use client';

import { useParams } from 'next/navigation';
import FormPortfolio from '../components/form';

export default function EditPortfolioPage() {
  const params = useParams()

  return (
    <FormPortfolio type="edit" id={params.id.toString()}/>
  );
}
