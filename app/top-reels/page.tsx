import React from 'react';
import TopReelsClient from './TopReelsClient';
import { getTrendstaData } from '../lib/dataLoader';

export default function TopReelsPage() {
    const data = getTrendstaData();
    // Pass the entire data object or specifically what we need for both views
    return <TopReelsClient data={data} />;
}
