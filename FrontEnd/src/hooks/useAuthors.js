import useApi from './useApi';
import { authorAPI } from '../services/api';
import { useState } from 'react';

export const useAuthors = () => {
  return useApi(() => authorAPI.getAll(), []);
};

export const useAuthor = (id) => {
  return useApi(() => authorAPI.getById(id), null, [id]);
};

export const useCreateAuthor = () => {
  const [mutate, setMutate] = useState(null);
  const { data, loading, error } = useApi(mutate, null);
  
  const createAuthor = (authorData) => {
    setMutate(() => () => authorAPI.create(authorData));
  };
  
  return { createAuthor, data, loading, error };
};