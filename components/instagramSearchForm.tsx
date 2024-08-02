import axios from 'axios';
import { useState } from 'react';

interface InstagramProfile {
    username: string;
    followersCount: number;
    followsCount: number;
    postsCount: number;
    profilePicUrl: string;
    fullName: string;
    biography: string;
    [key: string]: any;
}

const InstagramProfileSearch = () => {
    const [username, setUsername] = useState('');
    const [profileData, setProfileData] = useState<InstagramProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        setProfileData(null);

        try {
            const response = await axios.get(`/api/instagram?username=${username}`);
            const data = response.data;
            if (data.length > 0) {
                setProfileData(data[0]);
            } else {
                setError('No profile data found');
            }
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
            {profileData && (
                <div>
                    <h3>{profileData.fullName} (@{profileData.username})</h3>
                    <img src={profileData.profilePicUrl} alt={`${profileData.username}'s profile picture`} />
                    <p>Followers: {profileData.followersCount}</p>
                    <p>Following: {profileData.followsCount}</p>
                    <p>Posts: {profileData.postsCount}</p>
                    <p>Biography: {profileData.biography}</p>
                </div>
            )}
        </div>
    );
};

export default InstagramProfileSearch;
