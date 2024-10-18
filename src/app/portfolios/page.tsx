'use client'

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

export default function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[] | []>([])

  const getPortfolios = async () => {
    try {
      const res = await fetch('/api/portfolios', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const json = await res.json();
        setPortfolios(json.data);
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getPortfolios()
  }, [])

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
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {portfolios.map((portfolio) => (
            <tr key={portfolio.id} className="border-b">
              <td className="py-2 px-4">{portfolio.id}</td>
              <td className="py-2 px-4">{portfolio.company}</td>
              <td className="py-2 px-4">{portfolio.title}</td>
              <td className="py-2 px-4">
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
