'use client';

import customFetch from '@/customFetch';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Params = {
    params: {
        id: string
    }
}

export default function UploadPage({params: {id}}: Params) {
  const [loaded, setLoaded] = useState(false)
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [uploads, setUploads] = useState<Upload[] | []>([]);
  const [inputKey, setInputKey] = useState(Date.now());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getPortfolio = async () => {
    try {
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
        } catch (err) {
          console.log(err)
        }
    }

    const getUploads = async (portfolioId: string) => {
        try {
            const res = await customFetch(`/api/uploads?portfolioId=${portfolioId}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            });

            if (res.data) {
                setUploads(res.data);
            }
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        getPortfolio()
    }, [])

    useEffect(() => {
        if (id) getUploads(id)
    }, [loaded, id])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('portfolioId', id);
      formData.append('file', selectedFile!);
      formData.append('name', title);

      const res = await customFetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setSelectedFile(null)
        setInputKey(Date.now())
        setLoaded(!loaded)
      }
    } catch (err) {
        console.log(err)
    } finally {
        setInputKey(Date.now())
        setSelectedFile(null)
        setLoaded(!loaded)
    }
  };

  const deleteImage = async (id: number) => {
    try {
        const res = await customFetch(`/api/uploads`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id: id})
        });

        if (res.data) {
            setLoaded(!loaded)
        }
    } catch (err) {
        console.log(err);
    }    
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Upload Gambar
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="company" className="block text-sm font-medium">Company: {company}</label>
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Title: {title}</label>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description: {description}</label>
        </div>
        <div>
          <label htmlFor="tag" className="block text-sm font-medium">Tags: {tag}</label>
        </div>
        <div>
            <label htmlFor="dateFrom" className="block text-sm font-medium">Date: {dateFrom} - {dateTo}</label>
        </div>
        <div className="flex items-center space-x-6 mt-5">
          <label className="block">
            <span className="sr-only">Choose Portfolio Photo</span>
            <input
                key={inputKey}
                type="file"
                className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-gray-700
                hover:file:bg-violet-100"
                onChange={handleFileChange}
            />
          </label>
        </div>      
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Upload
        </button>
      </form>

      <hr className="mt-5"/>
      {uploads ? <div className="flex mt-5">
        {
            uploads.map(upload => {
                return (
                    <div key={upload.id} className="flex-1 w-64 mr-2">
                        <div key={upload.id} className="relative">
                            <Image src={`/api/uploads/${upload.name}`} alt={upload.name} height={100} width={100} className="rounded-md w-full"/>
                            <button className="absolute top-0 left-2 text-white bg-red-400/70 rounded px-2 py-1 mt-1" onClick={() => deleteImage(upload.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </div>
                )
            })
        }
        </div> : <p>Upload image first</p>
      }
    </div>
  );
}
