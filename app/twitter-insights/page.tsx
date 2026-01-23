import React from 'react';
import TwitterClient from './TwitterClient';
import { getTrendstaData } from '../lib/dataLoader';

export default function TwitterInsightsPage() {
    const data = getTrendstaData();
    const topTweets = data.top_tweets_data || [];
    const latestTweets = data.latest_tweets_data || [];

    return <TwitterClient topTweets={topTweets} latestTweets={latestTweets} />;
}
