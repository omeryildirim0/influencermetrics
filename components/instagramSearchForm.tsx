import { useState } from 'react';
import axios from 'axios';

interface InstagramProfile {
  username: string;
  followers: number;
  following: number;
  posts: number;
  [key: string]: any;
}

const InstagramSearchForm = () => {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setProfile(null);

    try {
      const response = await axios.get(`/api/instagram?username=${username}`);
      setProfile(response.data);
    } catch (err) {
      setError('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter Instagram username"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Loading...' : 'Search'}
      </button>
      {error && <p>{error}</p>}
      {profile && (
        <div>
          <h3>{profile.username}</h3>
          <p>Followers: {profile.followers}</p>
          <p>Following: {profile.following}</p>
          <p>Posts: {profile.posts}</p>
          {/* Add more profile details here as needed */}
        </div>
      )}
    </div>
  );
};

export default InstagramSearchForm;
