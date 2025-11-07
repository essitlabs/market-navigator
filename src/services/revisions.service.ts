export interface RevisionsQueryParams {
    sector?: string;
    startDate?: string;
    endDate?: string;
}

export interface CompanyRevisionData {
    Symbol: string;
    Name: string;
    Sector: string;
    MarketCap: number;
    
    // Price data
    PriceChange: number;
    
    // Sales data
    SalesNTMChange: number;
    SalesLTermChange: number;
    SalesNTMvsLTerm: number;
    SalesMultipleChange: number;
    
    // EBITDA data
    EBITDANTMChange: number;
    EBITDALTermChange: number;
    EBITDANTMvsLTerm: number;
    EBITDAMultipleChange: number;
    
    // Trend calculations
    SalesTrend: number;
    EBITDATrend: number;
    PriceTrend: number;
    
    // Trend changes
    SalesTrendChange: number;
    EBITDATrendChange: number;
}

export interface RevisionsResponse {
    sector: string;
    fromDate: string;
    toDate: string;
    total: number;
    data: CompanyRevisionData[];
}

export async function fetchRevisionsData({
    queryKey,
}: {
    queryKey: [string, RevisionsQueryParams];
}): Promise<RevisionsResponse> {
    const [, params] = queryKey;
    
    const searchParams = new URLSearchParams();
    
    if (params.sector) searchParams.append("sector", params.sector);
    if (params.startDate) searchParams.append("startDate", params.startDate);
    if (params.endDate) searchParams.append("endDate", params.endDate);

    const url = `/api/revisions?${searchParams.toString()}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch revisions data: ${response.statusText}`);
    }
    
    return response.json();
}

