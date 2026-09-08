import { createSlice } from "@reduxjs/toolkit";
import { storage } from "../../utils/storage";
import {
  loginThunk,
  registerThunk,
  fetchProfileThunk,
  logoutThunk,
} from "../thunks/authThunk";

const initialState = {
  user: storage.getUser(),
  token: storage.getToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      storage.clear();
      state.user = null;
      state.token = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        // Backend's AuthResponse has no nested "user" — build one from its fields.
        const { token, email, role, id } = action.payload;
        const user = { id, email, role };

        state.loading = false;
        state.token = token;
        state.user = user;
        storage.setUser(user);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        storage.setUser(action.payload);
      })

      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(logoutThunk.rejected, (state) => {
        // The thunk calls storage.clear() unconditionally, success or
        // failure (e.g. the /auth/logout network call itself fails) — this
        // must mirror that. Without it, Redux keeps thinking the user is
        // still signed in even though localStorage was already wiped,
        // which is exactly what let logged-out users still see
        // authenticated menu items (mobile "More" sheet, protected routes)
        // until a manual refresh.
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;