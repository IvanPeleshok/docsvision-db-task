import { databaseAPI } from "../api/api-database"
import {
  IPlace,
  IInventory,
  IPlaceResponse,
  IInventoryResponse,
  IHierarchy,
} from "../interface/database"
import { TInferActions, TBaseThunk } from "../types/redux"
import { AlertifyStatusEnum } from "../types/types"
import {
  createHierarchyWeb,
  extractKeysFromDependencies,
  NestingLevel,
  putAllSetsOfKeysWithData,
} from "../utils/funcHelpers"
import { showAlert } from "../utils/showAlert"

export type TInitialState = typeof initialState
type TActions = TInferActions<typeof actions>
type TThunk = TBaseThunk<TActions>

let initialState = {
  hierarchy: [] as Array<IHierarchy>,
  inventory: [] as Array<IInventory>,
  currentInventory: [] as Array<IInventory>,
  currenNode: "",
  currenName: "",
  currenLevel: NestingLevel.above,
  loading: false,
}

export const databaseReducer = (
  state = initialState,
  action: TActions
): TInitialState => {
  switch (action.type) {
    case "DATABASE/SET_HEIRARCHY":
      return {
        ...state,
        hierarchy: action.payload,
      }
    case "DATABASE/SET_INVENTORY":
      return {
        ...state,
        inventory: action.payload,
      }
    case "DATABASE/SET_CURRENT_NODE":
      return {
        ...state,
        currenNode: action.payload,
      }
    case "DATABASE/SET_CURRENT_MANE_NODE":
      return {
        ...state,
        currenName: action.payload,
      }
    case "DATABASE/SET_CURRENT_INVENORY":
      return {
        ...state,
        currentInventory: action.payload,
      }
    case "DATABASE/SET_LOADING_TRUE":
      return {
        ...state,
        loading: true,
      }
    case "DATABASE/SET_LOADING_FALSE":
      return {
        ...state,
        loading: false,
      }
    case "DATABASE/SET_LEVEL_NODE":
      return {
        ...state,
        currenLevel: action.payload,
      }
    default:
      return state
  }
}

export const actions = {
  setHierarchy: (hierarchy: Array<IHierarchy>) =>
    ({
      type: "DATABASE/SET_HEIRARCHY",
      payload: hierarchy,
    } as const),
  setInventory: (inventory: Array<IInventory>) =>
    ({
      type: "DATABASE/SET_INVENTORY",
      payload: inventory,
    } as const),
  setCurrentNode: (node: string) =>
    ({
      type: "DATABASE/SET_CURRENT_NODE",
      payload: node,
    } as const),
  setCurrentNameNode: (name: string) =>
    ({
      type: "DATABASE/SET_CURRENT_MANE_NODE",
      payload: name,
    } as const),
  setCurrentInvenory: (currentInventory: Array<IInventory>) =>
    ({
      type: "DATABASE/SET_CURRENT_INVENORY",
      payload: currentInventory,
    } as const),
  setLoadingTrue: () => ({ type: "DATABASE/SET_LOADING_TRUE" } as const),
  setLoadingFalse: () => ({ type: "DATABASE/SET_LOADING_FALSE" } as const),
  setLevelNode: (levelNode: NestingLevel) =>
    ({ type: "DATABASE/SET_LEVEL_NODE", payload: levelNode } as const),
}

export const getHierarchy = (): TThunk => async (dispatch) => {
  try {
    dispatch(actions.setLoadingTrue())

    const response = await databaseAPI.getPlaces()

    const places: Array<IPlace> = response.map((place: IPlaceResponse) => ({
      name: place.data.name,
      id: place.id,
      parts: place.parts === undefined ? [] : place.parts,
    }))

    let hierarchy: Array<IPlace> = []
    // Building search
    places.forEach((place: IPlace) => {
      if (place.id.indexOf("-") === -1) {
        hierarchy.push({ id: place.id, parts: place.parts, name: place.name })
      }
    })
  
    const hierarchyWithNodes: IHierarchy[] = createHierarchyWeb(hierarchy, places)

    dispatch(actions.setHierarchy(hierarchyWithNodes))

    dispatch(actions.setLoadingFalse())
  } catch (error) {}
}

export const getInventory = (): TThunk => async (dispatch) => {
  try {
    dispatch(actions.setLoadingTrue())

    const response = await databaseAPI.getInventory()

    const inventory = response?.map((inventory: IInventoryResponse) => ({
      name: inventory.data.name,
      count: +inventory.data.count,
      id: inventory.id,
      placeId: inventory.placeId,
    }))

    dispatch(actions.setInventory(inventory))

    dispatch(actions.setLoadingFalse())
  } catch (error) {}
}

const _updateListCurrentInvetory = (): TThunk => async (dispatch, getState) => {
  await dispatch(getInventory())

  const node = await putAllSetsOfKeysWithData(
    extractKeysFromDependencies(
      getState().database.currenNode,
      getState().database.hierarchy
    ),
    getState().database.inventory
  )
  dispatch(actions.setLevelNode(node.level))
  dispatch(actions.setCurrentInvenory(node.currentInventory))
}

export const createInventory = (
  name: string,
  count: number,
  id: string
): TThunk => async (dispatch) => {
  try {
    dispatch(actions.setLoadingTrue())

    await databaseAPI.createInventory(name, count, id)

    dispatch(_updateListCurrentInvetory())

    dispatch(actions.setLoadingFalse())

    showAlert(AlertifyStatusEnum.success, "Оборудование добавлено")
  } catch (error) {}
}

export const updateInventory = (inventory: IInventory): TThunk => async (
  dispatch
) => {
  try {
    dispatch(actions.setLoadingTrue())

    // await databaseAPI.updateInventory
    // Why I don't use it is written in api-database

    await databaseAPI.deleteInventory(inventory.id)
    await databaseAPI.createInventory(
      inventory.name,
      inventory.count,
      inventory.placeId
    )

    dispatch(_updateListCurrentInvetory())

    dispatch(actions.setLoadingFalse())

    showAlert(AlertifyStatusEnum.success, "Оборудование обновлено")
  } catch (error) {}
}

export const removeInventory = (id: string): TThunk => async (dispatch) => {
  try {
    dispatch(actions.setLoadingTrue())

    await databaseAPI.deleteInventory(id)

    dispatch(_updateListCurrentInvetory())

    dispatch(actions.setLoadingFalse())

    showAlert(AlertifyStatusEnum.success, "Оборудование удалено")
  } catch (error) {}
}
