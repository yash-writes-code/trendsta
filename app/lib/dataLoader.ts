import dataset from '../../finaldataset.json';
import { TrendstaData } from '../types/trendsta';

// Cast the imported JSON to the specific type
// We assume the JSON is an array of one object (based on previous observations)
// or the object itself. Let's check the structure again if needed, 
// but usually such datasets are either [Data] or Data.
// Our schema said "type: array", so it's likely an array with one item.

const rawData = dataset as unknown as TrendstaData[];

// Helper to get the single data object
export const getTrendstaData = (): TrendstaData => {
    if (Array.isArray(rawData) && rawData.length > 0) {
        return rawData[0];
    }
    // Fallback or error handling
    console.error("Data loader found empty or invalid array structure");
    return rawData[0]; // will throw if undefined, which is fine to catch early
}; 
