import { useQuery } from "@tanstack/react-query";
import { fetchLineChartData, LineChartQueryParams } from "@/services/line-chart.service";

export function useLineChartData(params: LineChartQueryParams) {
    return useQuery({
        queryKey: ["lineChartData", params],
        queryFn: fetchLineChartData,
        enabled: !!params.sector, // Only fetch if sector is provided
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

