import { NextRequest, NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';

// Function to handle GET requests
export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const apifyToken = process.env.APIFY_API_TOKEN;

    if (!apifyToken) {
        return NextResponse.json({ error: 'Internal Server Error: Missing APIFY_API_TOKEN' }, { status: 500 });
    }

    try {
        // Initialize Apify Client
        const client = new ApifyClient({
            token: apifyToken,
        });

        // Prepare Actor input
        const input = {
            usernames: [username],
        };

        // Run the Actor and wait for it to finish
        const run = await client.actor('apify~instagram-profile-scraper').call(input);

        // Function to delay execution
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        // Poll for run status
        let runStatus = run.status;
        while (runStatus !== 'SUCCEEDED' && runStatus !== 'FAILED') {
            console.log(`Current run status: ${runStatus}. Waiting for completion...`);
            await delay(5000); // Wait for 5 seconds

            const runDetails = await client.run(run.id).get();

            // Check if runDetails is undefined
            if (!runDetails) {
                return NextResponse.json({ error: 'Unable to fetch run details' }, { status: 500 });
            }

            runStatus = runDetails.status;
        }


        if (runStatus === 'FAILED') {
            return NextResponse.json({ error: 'Run failed' }, { status: 500 });
        }

        // Fetch and print Actor results from the run's dataset
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        // Log the output to the console
        console.log('Results from dataset', items);

        // Return the output as the response
        return NextResponse.json(items, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
