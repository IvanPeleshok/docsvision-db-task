interface IName {
  name: string
}

export interface IPlace extends IName {
  id: string
  parts: Array<string>
}

export interface IPlaceResponse extends IPlace {
  data: {
    name: string
  }
}

interface ICount {
  count: number
}

export interface IInventory extends IName, ICount {
  id: string
  placeId: string
}

export interface IInventoryResponse extends IInventory {
  data: {
    name: string
    count: number
  }
}

export interface IHierarchy {
  id: string
  parts: Array<IHierarchy>
  name: string
}
