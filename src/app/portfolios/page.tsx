'use client'

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import customFetch from '@/customFetch';
import { formatMonthYear } from '@/utils';

export default function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[] | []>([])
  const [loading, setIsLoading] = useState(false)

  const getPortfolios = async () => {
    setIsLoading(true)
    try {
      const res = await customFetch('/api/portfolios', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.data) {
        setPortfolios(res.data);
      } else {
        setPortfolios([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getPortfolios()
  }, [])

  const timePeriod = (portfolio: Portfolio) => {
    if (portfolio.dateFrom && portfolio.dateTo) {
      return formatMonthYear(portfolio.dateFrom) + ' - ' + formatMonthYear(portfolio.dateTo);
    } else if (portfolio.dateFrom) {
      return formatMonthYear(portfolio.dateFrom);
    } else if (portfolio.dateTo) {
      return formatMonthYear(portfolio.dateTo);
    }
    return '';
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Portfolios</h2>
        <Link href="/portfolios/add">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Portfolio
          </button>
        </Link>
      </div>
      <table className="min-w-full bg-white rounded shadow-md text-black">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Company</th>
            <th className="py-2 px-4">Title</th>
            <th className="py-2 px-4">Period</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading && <tr>
            <td colSpan={4} className="text-center">Loading...</td>
          </tr>}
          {portfolios.map((portfolio) => (
            <tr key={portfolio.id} className="border-b">
              <td className="py-2 px-4">{portfolio.id}</td>
              <td className="py-2 px-4">{portfolio.company}</td>
              <td className="py-2 px-4">{portfolio.title}</td>
              <td className="py-2 px-4">{timePeriod(portfolio)}</td>
              <td className="py-2 px-4 flex flex-col sm:flex-row">
                <Link
                    href={`/portfolios/${portfolio.id}`}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                ><FontAwesomeIcon icon={faEdit} /></Link>
                <Link
                    href={`/portfolios/${portfolio.id}/uploads`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                ><FontAwesomeIcon icon={faUpload} /></Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
