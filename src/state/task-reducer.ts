import { tasksObjType } from "../App";
import {
  AddTodoListAction,
  RemoveTodoListAction,
  todoListId1,
  todoListId2,
} from "./todo-reducer";

import { v1 } from "uuid";

// типы акшенов
export type RemoveTask = {
  type: "REMOVE-TASK";
  taskId: string;
  todolistId: string;
};
export type AddTask = {
  type: "ADD-TASK";
  title: string;
  todolistId: string;
};
export type ChangeTaskStatus = {
  type: "CHANGE-TASK-STATUS";
  taskId: string;
  todolistId: string;
  isDone: boolean;
};
export type ChangeTitleStatus = {
  type: "CHANGE-TITLE-STATUS";
  taskId: string;
  todolistId: string;
  title: string;
};

// объединяем типы экшенов для редьюсер - он принимает или такой, или такой  и тд
type Actions =
  | RemoveTask
  | AddTask
  | ChangeTaskStatus
  | ChangeTitleStatus
  | AddTodoListAction
  | RemoveTodoListAction;

const initialState: tasksObjType = {
  [todoListId1]: [
    { id: v1(), title: "Learn JS", isDone: false },
    { id: v1(), title: "Learn React", isDone: true },
    { id: v1(), title: "Learn ", isDone: true },
  ],
  [todoListId2]: [
    { id: v1(), title: "Book", isDone: false },
    { id: v1(), title: "Cheir", isDone: true },
  ],
};

// reducer принимает стает с типом обьекта тасок
//         принимает акшен с типом всех видов тасок
export const tasksReducer = (
  // если придет  андефайнед(при первом диспаче) то присвоим стайту инишиал стайт
  state: tasksObjType = initialState,
  action: Actions
): tasksObjType => {
  // следим за тем, какой тип получили из объекта экшен
  switch (action.type) {
    // если тип такой, то удаляем
    case "REMOVE-TASK": {
      const stateCopy = { ...state };
      // достать нужный массив тасок по айди-туду из экшена
      const tasks = state[action.todolistId];
      // фильтруем массив тасок, исключая ту таску,которую нужно удалить
      const filteredTasks = tasks.filter((t) => t.id !== action.taskId);
      //  в копии стейта ищем нужный массив тасок
      //  перезаписываем его - добавив новый массив без удаленного обьекта-таски
      stateCopy[action.todolistId] = filteredTasks;
      return stateCopy;
    }
    case "ADD-TASK": {
      const stateCopy = {
        ...state,
      };
      // получить массив тасок,в который нужно добавить новую таску
      const tasks = stateCopy[action.todolistId];
      //формируем эту новую таску
      let newTask = { id: v1(), title: action.title, isDone: false };
      // новый массив, в к-ом есть новая таска
      const newTasks = [newTask, ...tasks];
      //перазаписывем копию стайта
      stateCopy[action.todolistId] = newTasks;
      return stateCopy;
    }
    case "CHANGE-TASK-STATUS": {
      const stateCopy = { ...state };
      let tasks = stateCopy[action.todolistId];

      stateCopy[action.todolistId] = tasks.map((task) =>
        task.id === action.taskId ? { ...task, isDone: action.isDone } : task
      );      
      return stateCopy;
    }
    case "CHANGE-TITLE-STATUS": {
      const copyState = {
        ...state,
      };
      const tasks = copyState[action.todolistId];

      let task = tasks.find((t) => t.id === action.taskId);
      if (task) {
        task.title = action.title;
      }
      return copyState;
    }
    // нам нужно добавить тудулист  стейт тасок тоже!
    // именно в него потом добавляем новые таски
    case "ADD-TODOLIST": {
      const stateCopy = {
        ...state,
      };
      stateCopy[action.tolistId] = [];
      return stateCopy;
    }
    case "REMOVE-TODOLIST": {
      const copyState = { ...state };
      // удаляем туду через айди из экшена
      delete copyState[action.id];
      return copyState;
    }
    default:
      return state;
  }
};

// формируем объекты - экшены
// принимаем нужные данные - тип и доп.штуки
// возвращаем объект нужного типа
export const removeTaskAC = (
  taskId: string,
  todolistId: string
): RemoveTask => {
  return { type: "REMOVE-TASK", taskId, todolistId };
};
export const addTaskAC = (title: string, todolistId: string): AddTask => {
  return { type: "ADD-TASK", title, todolistId };
};
export const changeTaskStatusAC = (
  taskId: string,
  todolistId: string,
  isDone: boolean
): ChangeTaskStatus => {
  return { type: "CHANGE-TASK-STATUS", taskId, todolistId, isDone };
};
export const changeTaskTitleAC = (
  taskId: string,
  todolistId: string,
  title: string
): ChangeTitleStatus => {
  return { type: "CHANGE-TITLE-STATUS", taskId, todolistId, title };
};
