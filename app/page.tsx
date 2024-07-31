'use client';
import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"



export default function Home() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/instagramProfile?username=${username}`);
      setError('');
    } catch (err) {
      setError('Failed to fetch data');
      setData(null);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Instagram Influencer Search</h1>
      <Input
        type="text"
        placeholder="Enter Instagram Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-lg"
      />
      <Button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded-lg">
        Search
      </Button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {data && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold">Profile Data</h2>
          <pre className="bg-gray-200 p-4 rounded-lg mt-4">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
