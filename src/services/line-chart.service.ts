export interface LineChartQueryParams {
    sector?: string;
    startDate?: string;
    endDate?: string;
}

export interface LineChartDataPoint {
    date: string;
    priceChange: number;
    fundamentalAbsolute: number;
    trendLine: number;
    absolutePrice: number;
}

export interface LineChartResponse {
    sector: string;
    startDate: string | null;
    endDate: string | null;
    dataPoints: number;
    data: LineChartDataPoint[];
}

export async function fetchLineChartData({
    queryKey,
}: {
    queryKey: [string, LineChartQueryParams];
}): Promise<LineChartResponse> {
    const [, params] = queryKey;
    
    const searchParams = new URLSearchParams();
    
    if (params.sector) searchParams.append("sector", params.sector);
    if (params.startDate) searchParams.append("startDate", params.startDate);
    if (params.endDate) searchParams.append("endDate", params.endDate);

    const url = `/api/line-chart?${searchParams.toString()}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch line chart data: ${response.statusText}`);
    }
    
    return response.json();
}

