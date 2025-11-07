import { useQuery } from "@tanstack/react-query";

interface SectorsResponse {
    total: number;
    sectors: string[];
}

async function fetchSectors(): Promise<SectorsResponse> {
    const response = await fetch("/api/sectors");
    
    if (!response.ok) {
        throw new Error(`Failed to fetch sectors: ${response.statusText}`);
    }
    
    return response.json();
}

export function useSectors() {
    return useQuery({
        queryKey: ["sectors"],
        queryFn: fetchSectors,
        staleTime: Infinity, // Sectors don't change often
    });
}

