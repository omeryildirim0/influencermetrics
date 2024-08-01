import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const apifyToken = process.env.APIFY_API_TOKEN;

    if (!apifyToken) {
        console.error('APIFY_API_TOKEN is not set');
        return NextResponse.json({ error: 'Internal Server Error: Missing APIFY_API_TOKEN' }, { status: 500 });
    }

    try {
        const apifyActId = 'apify~instagram-profile-scraper'; // Correct actor ID with tilde (~)
        const runResponse = await axios.post(
            `https://api.apify.com/v2/acts/${apifyActId}/runs?token=${apifyToken}`,
            { usernames: [username] } // Updated payload to match API requirements
        );

        const { data: run } = runResponse;
        console.log('Run started:', run);

        let result;
        let runStatus;
        do {
            const runDetails = await axios.get(
                `https://api.apify.com/v2/acts/${apifyActId}/runs/${run.data.id}?token=${apifyToken}`
            );
            console.log('Run details:', runDetails.data);

            runStatus = runDetails.data.status;
            if (runStatus === 'SUCCEEDED') {
                result = runDetails.data.output.body;
            } else if (runStatus === 'FAILED') {
                return NextResponse.json({ error: 'Scraping failed' }, { status: 500 });
            }
        } while (runStatus !== 'SUCCEEDED');

        return NextResponse.json(result, { status: 200 });
    } catch (unknownError) {
        const error = unknownError as { response?: { data: any }, message: string };
        console.error('Error in API:', error.response ? error.response.data : error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
