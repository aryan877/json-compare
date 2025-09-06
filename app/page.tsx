"use client";

import { useState, useEffect } from 'react';
import JsonView from '@uiw/react-json-view';

interface ResponseData {
  success: boolean;
  data: {
    title?: string;
    slug?: string;
    description?: string;
    difficulty?: string;
    tags?: string[];
    constraints?: string;
    askedByCompanies?: string[];
    isLocked?: boolean;
    isPublished?: boolean;
    isFeatured?: boolean;
    solutionVideoUrl?: string;
    editorialNotes?: string;
    codingProblemTestCases?: unknown[];
    // ... and many more fields
    [key: string]: unknown;
  };
}

export default function Home() {
  const [jsonData1, setJsonData1] = useState<ResponseData | null>(null);
  const [jsonData2, setJsonData2] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          fetch('/data/response-v1.json'),
          fetch('/data/response-v2.json')
        ]);

        if (!response1.ok || !response2.ok) {
          throw new Error('Failed to fetch JSON files');
        }

        const data1 = await response1.json();
        const data2 = await response2.json();

        setJsonData1(data1);
        setJsonData2(data2);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading JSON data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
          JSON Response Comparison
        </h1>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Response V1 (8min 20s)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Response V2 (2min 20s)</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Response V1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-blue-500">
            <div className="bg-blue-50 px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-blue-800">
                Response V1 - 8 minutes 20 seconds
              </h2>
              <p className="text-blue-600 text-sm mt-1">
                Slower response time
              </p>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <JsonView
                value={jsonData1 || {}}
                collapsed={false}
                displayDataTypes={false}
                enableClipboard={true}
                shortenTextAfterLength={0}
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  wordBreak: 'break-word'
                } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Response V2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-green-500">
            <div className="bg-green-50 px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-green-800">
                Response V2 - 2 minutes 20 seconds
              </h2>
              <p className="text-green-600 text-sm mt-1">
                Faster response time
              </p>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <JsonView
                value={jsonData2 || {}}
                collapsed={false}
                displayDataTypes={false}
                enableClipboard={true}
                shortenTextAfterLength={0}
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  wordBreak: 'break-word'
                } as React.CSSProperties}
              />
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        {jsonData1 && jsonData2 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Comparison Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {jsonData1.data?.title ? "✓" : "✗"}
                </div>
                <div className="font-semibold text-blue-800">V1 Title</div>
                <div className="text-sm text-blue-600 mt-1 truncate">
                  {jsonData1.data?.title || "No title"}
                </div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {jsonData2.data?.title ? "✓" : "✗"}
                </div>
                <div className="font-semibold text-green-800">V2 Title</div>
                <div className="text-sm text-green-600 mt-1 truncate">
                  {jsonData2.data?.title || "No title"}
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-600 mb-2">
                  {jsonData1.data?.title === jsonData2.data?.title ? "=" : "≠"}
                </div>
                <div className="font-semibold text-gray-800">Titles Match</div>
                <div className="text-sm text-gray-600 mt-1">
                  {jsonData1.data?.title === jsonData2.data?.title ? "Identical" : "Different"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Response V1 Stats</h4>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>Difficulty: {jsonData1.data?.difficulty || "N/A"}</li>
                  <li>Tags: {jsonData1.data?.tags?.length || 0}</li>
                  <li>Companies: {jsonData1.data?.askedByCompanies?.length || 0}</li>
                  <li>Test Cases: {jsonData1.data?.codingProblemTestCases?.length || 0}</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Response V2 Stats</h4>
                <ul className="text-sm text-green-600 space-y-1">
                  <li>Difficulty: {jsonData2.data?.difficulty || "N/A"}</li>
                  <li>Tags: {jsonData2.data?.tags?.length || 0}</li>
                  <li>Companies: {jsonData2.data?.askedByCompanies?.length || 0}</li>
                  <li>Test Cases: {jsonData2.data?.codingProblemTestCases?.length || 0}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Performance Note */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Performance Note:</strong> Response V2 was significantly faster (2m 20s vs 8m 20s), 
                which is approximately 3.6x faster than Response V1. Both responses appear to contain 
                similar structured data for coding problems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}