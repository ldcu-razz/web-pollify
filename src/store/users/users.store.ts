import { Pagination } from "@models/common/common.type";
import { GetPaginatedUsersFilters, PostUser, User } from "@models/users/users.type";
import { signalStore, withState, withProps, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from "@services/users.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from "rxjs";

interface UserState {
  users: User[];
  pagination: Pagination;
  loading: boolean;
  searchQuery: string;
  searchLoading: boolean;
  formLoading: boolean;
  deletingUserLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  loading: false,
  searchQuery: '',
  searchLoading: false,
  formLoading: false,
  deletingUserLoading: false,
  error: null,
}

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    userService: inject(UsersService),
    snackBar: inject(MatSnackBar),
  })),
  withMethods(({ userService, snackBar, ...store }) => ({
    getUsers: async (payload: Pagination, filters: GetPaginatedUsersFilters) => {
      patchState(store, { loading: true });
      try {
        const result = await userService.getUsers(payload, filters);
        patchState(store, { users: result.data, pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
        }, loading: false });
      } catch (error) {
        patchState(store, { error: error as string, loading: false });
        snackBar.open("Failed to get users", "Close", { duration: 3000 });
      }
    },

    getUser: async (userId: string) => {
      patchState(store, { loading: true });
      try {
        const result = await userService.getUser(userId);
        patchState(store, { users: [result, ...store.users()], loading: false });
      } catch (error) {
        patchState(store, { error: error as string, loading: false });
      }
    },

    createUser: async (payload: PostUser) => {
      patchState(store, { formLoading: true });
      try {
        const result = await userService.createUser(payload);
        patchState(store, { users: [result, ...store.users()], formLoading: false });
        snackBar.open("User created successfully", "Close", { duration: 3000 });
      } catch (error) {
        patchState(store, { error: error as string, formLoading: false });
        snackBar.open("Failed to create user", "Close", { duration: 3000 });
      }
    },

    searchUsers: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query) => patchState(store, { searchQuery: query, searchLoading: true })),
        switchMap(async (query) => {
          const result = await userService.getUsers(store.pagination(), { q: query });
          patchState(store, { users: result.data, pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
          }, searchLoading: false });
        })
      )
    ),
    
    filterUsers: async (payload: GetPaginatedUsersFilters) => {
      patchState(store, { loading: true });
      try {
        const result = await userService.getUsers(store.pagination(), { q: store.searchQuery(), status: payload.status, role: payload.role });
        patchState(store, { users: result.data, pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
        }, loading: false });
      } catch (error) {
        patchState(store, { error: error as string, loading: false });
      }
    },

    deleteUser: async (userId: string) => {
      patchState(store, { deletingUserLoading: true });
      await userService.deleteUser(userId);
      patchState(store, { users: store.users().filter(user => user.id !== userId), deletingUserLoading: false });
      snackBar.open("User deleted successfully", "Close", { duration: 3000 });
    },
  }))
)