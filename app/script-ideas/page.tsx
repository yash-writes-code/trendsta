import React from 'react';
import ScriptIdeasClient from './ScriptIdeasClient';
import { getTrendstaData } from '../lib/dataLoader';

export default function ScriptIdeasPage() {
    const data = getTrendstaData();
    const scripts = data.LLM_script_ideas || [];

    return <ScriptIdeasClient scripts={scripts} />;
}
