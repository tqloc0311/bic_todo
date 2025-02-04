import { Alert, Pressable, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import TaskActions from '@bic_todo/components/tasks/task-actions';
import { Box, Theme } from '@bic_todo/utils/theme';

import { useAppDispatch } from '@bic_todo/redux/hooks';
import * as actions from './actions';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  HomeNavigationType,
  HomeStackParams,
} from '@bic_todo/navigation/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';

type UpdateTaskScreenProp = RouteProp<HomeStackParams, 'UpdateTask'>;

const UpdateTaskScreen = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme<Theme>();
  const route = useRoute<UpdateTaskScreenProp>();
  const navigation = useNavigation<HomeNavigationType>();

  const { task } = route.params;

  const deleteTask = () => {
    if (task) {
      dispatch(actions.deleteTask(task.id))
        .then(() => {
          navigation.pop();
        })
        .catch(error => {
          Alert.alert('Error', error);
        });
    }
  };

  const renderDeletingButton = () => {
    return (
      <Pressable onPress={deleteTask}>
        <MaterialCommunityIcons
          name="delete"
          size={24}
          color={theme.colors.red500}
        />
      </Pressable>
    );
  };

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      navigation.setOptions({
        headerRight: () => renderDeletingButton(),
      });
    });

    return () => {
      unsubscribeFocus();
    };
  }, [navigation]);

  return (
    <Box bg="white" flex={1} p="4">
      <TaskActions task={task} onSubmitted={() => navigation.pop()} />
    </Box>
  );
};

export default UpdateTaskScreen;

const styles = StyleSheet.create({});
