import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  searchThunk,
} from "../redux/thunks/searchThunk";

export default function useSearch() {
  const dispatch =
    useDispatch();

  const {
    results,
    loading,
    error,
  } = useSelector(
    (state) =>
      state.search
  );

  const search =
    (keyword) => {
      dispatch(
        searchThunk(
          keyword
        )
      );
    };

  return {
    results,
    loading,
    error,
    search,
  };
}