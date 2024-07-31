'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


export default function Home() {
  const [username, setUsername] = useState('');

  const handleSearch = () => {
    console.log(`Searching for username: ${username}`);
    // Here you can add your API call to fetch influencer data
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
    </div>
  )
}
