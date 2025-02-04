import React, { useEffect, useRef } from 'react';
import {
  CategoriesNavigationType,
  CategoriesStackParams,
} from '@bic_todo/navigation/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@bic_todo/redux/hooks';
import { FlatList } from 'react-native';
import { Box } from '@bic_todo/utils/theme';
import { fetchAllTasksByCategoryId } from './actions';
import TaskTile from '@bic_todo/components/tasks/task-tile';

type CategoryTaskScreenProp = RouteProp<CategoriesStackParams, 'CategoryTasks'>;

const CategoryTaskScreen = () => {
  const dispatch = useAppDispatch();
  const route = useRoute<CategoryTaskScreenProp>();
  const navigation = useNavigation<CategoriesNavigationType>();
  const { categoryTasks } = useAppSelector(state => state.task);
  const page = useRef(1);
  const hasMoreData = useRef(true);

  const { category } = route.params;

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      navigation.setOptions({
        title: category?.name,
      });
    });

    return () => {
      unsubscribeFocus();
    };
  }, [navigation]);

  useEffect(() => {
    dispatch(
      fetchAllTasksByCategoryId({
        categoryId: category.id,
        page: page.current,
      }),
    );
  }, []);

  const fetchMore = () => {
    page.current = page.current + 1;
    dispatch(
      fetchAllTasksByCategoryId({
        categoryId: category.id,
        page: page.current,
      }),
    ).then(_hasMoreData => {
      hasMoreData.current = _hasMoreData.payload as boolean;
    });
  };

  return (
    <Box bg="white" flex={1} p="4">
      <FlatList
        data={categoryTasks}
        renderItem={({ item }) => <TaskTile task={item} />}
        ItemSeparatorComponent={() => <Box height={14} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        onEndReached={hasMoreData ? fetchMore : null}
        onEndReachedThreshold={0.5}
      />
    </Box>
  );
};

export default CategoryTaskScreen;
