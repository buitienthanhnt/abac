import { useQuery } from "@tanstack/react-query";
import { getLodeData } from "../query/lode";

const useLode = (dates = 365) => {
  const query = useQuery({
    queryKey: ['lode-data', dates], queryFn: () => {
      return getLodeData(dates);
    }
  });

  return { ...query };
}

export default useLode