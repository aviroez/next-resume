'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import QuillEditor from '@/app/components/quillEditor';
import customFetch from '@/customFetch';

interface FormPortfolioProps {
    type: 'add' | 'edit';
    id?: string
  }

export default function FormPortfolio({ type, id }: FormPortfolioProps) {
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleEditorChange = (value: string) => {
    setDescription(value);
  };

  const getPortfolio = async () => {
    try {
      if (type == 'edit'){
        const res = await customFetch(`/api/portfolios/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.data) {
          const portfolio = res.data;

          if (portfolio) {
            setCompany(portfolio.company)
            setTitle(portfolio.title)
            setTag(portfolio.tag)
            setDescription(portfolio.description)
            setDateFrom(portfolio.dateFrom)
            setDateTo(portfolio.dateTo)
          }
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getPortfolio()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const portfolioBody = {
        company: company,
        title: title,
        tag: tag,
        description: description,
        dateFrom: dateFrom,
        dateTo: dateTo,
      }
      const res = await customFetch('/api/portfolios', {
        method: type == 'edit' ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(type == 'edit' ? {...portfolioBody, id: parseInt(id!)} : portfolioBody)
      });

      if (res.data) {
        redirect('/portfolios')
      }
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {type == 'edit' ? 'Edit Portfolio' : 'Add New Portfolio'}        
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="company" className="block text-sm font-medium">Name</label>
          <input
            type="text"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            placeholder="Company..."
            required
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Title</label>
          <input
            type="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            placeholder="Title..."
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          {/** <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            placeholder="Description..."
            required
          ></textarea>  */}
          <QuillEditor value={description} onChange={handleEditorChange} />
        </div>
        <div>
          <label htmlFor="tag" className="block text-sm font-medium">Tag</label>
          <input
            type="text"
            id="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            placeholder="Tag, Tag, Tag, ..."
            required
          />
        </div>
        <div className="flex">
          <div className="flex-1">
            <label htmlFor="dateFrom" className="block text-sm font-medium">Date From</label>
            <input
              type="date"
              id="dateFrom"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          <div className="flex-1 ml-2">
            <label htmlFor="dateTo" className="block text-sm font-medium">Date To</label>
            <input
              type="date"
              id="dateTo"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save
        </button>
      </form>

      <hr className="mt-5"/>
    </div>
  );
}
