import { useQuery } from "@tanstack/react-query"
import { fetchSliverChartData, fetchSliverPercentData } from "../query/sliver"

export const useSliverChartData = (dates = 7, type = 'L') => {
  const query = useQuery({
    queryKey: ['sliver-chart', dates, type], queryFn: () => {
      return fetchSliverChartData(dates, type);
    }
  });

  return { ...query };
}

export const useSliverPercent = (dates = 7) => {
  const query = useQuery({
    queryKey: ['sliver-percent', dates], queryFn: () => {
      return fetchSliverPercentData(dates);
    }
  })

  return { ...query }
};