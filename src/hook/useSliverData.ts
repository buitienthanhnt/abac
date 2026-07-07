import { useQuery } from "@tanstack/react-query"
import { fetchSliverChartData } from "../query/sliver"

export const useSliverChartData = (dates = 7, type = 'L') => {
  const query = useQuery({
    queryKey: ['sliver-chart', dates, type], queryFn: () => {
      return fetchSliverChartData(dates, type);
    }
  });

  return { ...query };

}