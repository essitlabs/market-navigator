export interface SheetQueryParams {
    tab: string;
    sector?: string;
    startDate?: string;
    endDate?: string;

}

export interface SheetRow {
    [key: string]: string | number | null;
}

export interface SheetResponse {
    tab: string;
    total: number;
    sector: string;
    data: SheetRow[];
}

export async function fetchSheetData({
    queryKey,
}: {
    queryKey: [string, SheetQueryParams];
}): Promise<SheetResponse> {
    const [_key, params] = queryKey;
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
    ) as Record<string, string>;
    const query = new URLSearchParams(filteredParams);
    const res = await fetch(`/api/data?${query.toString()}`);

    if (!res.ok) {
        throw new Error(`Error fetching data: ${res.statusText}`);
    }

    return res.json();
}
