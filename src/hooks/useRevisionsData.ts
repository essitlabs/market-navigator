import { useQuery } from "@tanstack/react-query";
import { fetchRevisionsData, RevisionsQueryParams } from "@/services/revisions.service";

export function useRevisionsData(params: RevisionsQueryParams) {
    return useQuery({
        queryKey: ["revisionsData", params],
        queryFn: fetchRevisionsData,
        enabled: !!params.sector, // Only fetch if sector is provided
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

